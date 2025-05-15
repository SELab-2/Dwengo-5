import { ContentType } from "@prisma/client";
import { prisma } from "./index.ts";

// rescraping will always overwrite; we have to request all objects anyway to get the version number...
// TODO: unique constraint in DB on (learningobject_hruid, language)?

async function createLearningPaths() {
    console.log("Scraping started...\n");

    const response = await fetch(
        "https://dwengo.org/backend/api/learningPath/search?all"
    );
    const learningPaths = await response.json();
    // set:
    let learningObjectsAddedDuringThisScrape = new Map<string, string>(); // hruid+language -> learning object _id
    for (const lp of learningPaths) {
        try {
            await prisma.$transaction(async (prisma) => {
                // overwrite existing learning path
                // first delete all dependent nodes so we don't get foreign key constraint violation errors
                await prisma.learningPathNode.deleteMany({
                    where: { learning_path_id: lp._id },
                });

                // delete the actual learning path                
                await prisma.learningPath.deleteMany({
                    where: { hruid: lp.hruid, language: lp.language },
                });

                const newLP = await prisma.learningPath.create({
                    data: {
                        id: lp._id,
                        hruid: lp.hruid,
                        language: lp.language,
                        title: lp.title,
                        description: lp.description,
                        image: lp.image, // TODO: to file hosting service
                    },
                });
                console.log(
                    `Created learning path: ${newLP.hruid} in language ${newLP.language} with id: ${newLP.id}`
                );

                // process each node
                if (lp.nodes && Array.isArray(lp.nodes)) {
                    const nodeMap = new Map();

                    for (const node of lp.nodes) {
                        const existingLO =
                            learningObjectsAddedDuringThisScrape.get(
                                node.learningobject_hruid + node.language
                            );
                        if (!existingLO) {
                            await prisma.learningObject.deleteMany({
                                where: {
                                    hruid: node.learningobject_hruid,
                                    language: node.language,
                                },
                            });

                            const metadataUrl = `https://dwengo.org/backend/api/learningObject/getMetadata?hruid=${node.learningobject_hruid}&language=${node.language}`;
                            const metaResponse = await fetch(metadataUrl);
                            const metaData = await metaResponse.json();

                            const rawUrl = `https://dwengo.org/backend/api/learningObject/getRaw?hruid=${node.learningobject_hruid}&language=${node.language}`;
                            const rawResponse = await fetch(rawUrl);
                            const htmlContent = await rawResponse.text();

                            const contentTypeKey =
                                metaData.content_type.replace(
                                    "/",
                                    "_"
                                ) as keyof typeof ContentType;
                            const contentType =
                                ContentType[contentTypeKey] ??
                                (metaData.content_type === "extern"
                                    ? ContentType.extern
                                    : ContentType.blocky);

                            // TODO voor db: wat hiervan gebruiken we in frontend, alles wat niet gebruikt verwijderen
                            const newLO = await prisma.learningObject.create({
                                data: {
                                    id: node._id,
                                    hruid: node.learningobject_hruid,
                                    uuid: metaData.uuid,
                                    language: node.language,
                                    version: String(node.version),
                                    html_content: htmlContent, // TODO: to file hosting service
                                    title: metaData.title,
                                    description: metaData.description,
                                    content_type: contentType,
                                    keywords: metaData.keywords,
                                    target_ages: metaData.target_ages,
                                    teacher_exclusive:
                                        metaData.teacher_exclusive,
                                    skos_concepts: metaData.skos_concepts,
                                    copyright: metaData.copyright,
                                    license: metaData.licence,
                                    difficulty: metaData.difficulty || -1, // is blijkbaar optioneel in Dwengo API (maar gaan wij het überhaupt gebruiken?)
                                    estimated_time: metaData.estimated_time,
                                    available: metaData.available,
                                    content_location: rawUrl,
                                },
                            });
                            console.log(
                                `\tCreated learning object: ${newLO.hruid} in language ${newLO.language} with id: ${newLO.id}`
                            );
                            learningObjectsAddedDuringThisScrape.set(
                                node.learningobject_hruid + node.language,
                                newLO.id
                            );
                        } else {
                            node._id = existingLO;
                            console.log(
                                `Skipping already existing learning object: ${node.learningobject_hruid}`
                            );
                        }

                        const newNode = await prisma.learningPathNode.create({
                            data: {
                                learning_object_id: node._id,
                                learning_path_id: lp._id,
                                start_node: node.start_node || false,
                            },
                        });

                        nodeMap.set(
                            node.learningobject_hruid + "+" + node.language,
                            newNode.id
                        );
                    }

                    for (const node of lp.nodes) {
                        if (
                            node.transitions &&
                            Array.isArray(node.transitions)
                        ) {
                            for (const transition of node.transitions) {
                                if (
                                    transition.next.hruid ===
                                    "zpn_voorkennisparameter"
                                ) {
                                    transition.next.hruid =
                                        "pn_parameterrechte";
                                }
                                if (
                                    transition.next._id ===
                                    "67e51a1e531d59ac3765abb2"
                                ) {
                                    transition.next.hruid =
                                        "leerlijn_grafisch_tekstueel_leerplandoelen";
                                }

                                const destinationNodeId = nodeMap.get(
                                    transition.next.hruid +
                                        "+" +
                                        transition.next.language
                                );
                                if (destinationNodeId === undefined) {
                                    throw new Error(
                                        `Destination node with id ${transition.next.hruid} and language ${transition.next.language} not found in nodeMap!`
                                    );
                                }

                                await prisma.transition.create({
                                    data: {
                                        condition_min:
                                            transition.condition_min || -1,
                                        condition_max:
                                            transition.condition_max || -1,
                                        source_node_id: nodeMap.get(
                                            `${transition.next.hruid}+${transition.next.language}`
                                        ),
                                        destination_node_id: destinationNodeId,
                                    },
                                });
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error(
                `Error processing learning path with id ${lp._id}:`,
                error
            );
        }
    }
}

createLearningPaths()
    .then(() => {
        console.log("\nAll learning paths created.");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\nError creating learning paths:", error);
        process.exit(1);
    });
