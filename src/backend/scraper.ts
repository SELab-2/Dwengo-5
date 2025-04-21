import { ContentType } from "@prisma/client";
import { prisma } from "./index.ts";
import { assert } from "console";
// TODO: make whole thing transactional per learning path + what to do in case of rescrape?
console.log("Scraper started...");

// TODO: think about _id in DB cuz Dwengo api design be useless

async function createLearningPaths() {
    const response = await fetch(
        "https://dwengo.org/backend/api/learningPath/search?all"
    );
    const learningPaths = await response.json();

    for (const lp of learningPaths) {
        // add learning path metadata to DB
        const newLP = await prisma.learningPath.create({
            data: {
                id: lp._id,
                hruid: lp.hruid,
                language: lp.language,
                title: lp.title,
                description: lp.description,
                image: lp.image,
            },
        });
        console.log(
            `Created learning path: ${newLP.hruid} in language ${newLP.language} with id: ${newLP.id}`
        );

        // process each node
        if (lp.nodes && Array.isArray(lp.nodes)) {
            const nodeMap = new Map(); // learningobject hruid+lang -> learning path node (auto-incrementedly generated) id

            // add all ndoes
            for (const node of lp.nodes) {
                // console.log(
                //     "checking node " + node.learningobject_hruid + node.language
                // );
                // check if learning object already exists in DB and if not, create it
                const existingLearningObjects =
                    await prisma.learningObject.findMany({
                        where: {
                            hruid: node.learningobject_hruid,
                            language: node.language,
                        },
                    });
                if (existingLearningObjects.length == 0) {
                    // metadata
                    const metadataUrl = `https://dwengo.org/backend/api/learningObject/getMetadata?hruid=${node.learningobject_hruid}&language=${node.language}`;
                    console.log(metadataUrl);
                    const metaResponse = await fetch(metadataUrl);
                    const metaData = await metaResponse.json();

                    // raw HTML content
                    const rawUrl = `https://dwengo.org/backend/api/learningObject/getRaw?hruid=${node.learningobject_hruid}&language=${node.language}`;
                    const rawResponse = await fetch(rawUrl);
                    const htmlContent = await rawResponse.text(); // TODO: removing \n's needed?

                    const contentTypeKey = metaData.content_type.replace(
                        "/",
                        "_"
                    ) as keyof typeof ContentType;
                    const contentType =
                        ContentType[contentTypeKey] ??
                        (metaData.content_type === "extern"
                            ? ContentType.extern
                            : ContentType.blocky);

                    // add to DB, TODO: wat hiervan gebruiken we in frontend, alles wat niet gebruikt verwijderen
                    console.log(metaData.uuid);
                    const newLO = await prisma.learningObject.create({
                        data: {
                            id: node._id,
                            hruid: node.learningobject_hruid,
                            uuid: metaData.uuid,
                            language: node.language,
                            version: String(node.version),
                            html_content: htmlContent, // TODO: overwegen of dit ook niet te groot is om in DB te steken
                            title: metaData.title,
                            description: metaData.description,
                            content_type: contentType,
                            keywords: metaData.keywords,
                            target_ages: metaData.target_ages,
                            teacher_exclusive: metaData.teacher_exclusive,
                            skos_concepts: metaData.skos_concepts,
                            // educational_goals: metadata.educational_goals, // uitgecomment want niet in db (en wrs ook nooit nodig voor app)
                            copyright: metaData.copyright,
                            license: metaData.licence,
                            difficulty: metaData.difficulty || -1, // TODO: is blijkbaar optioneel, maar gaan we het überhaupt gebruiken?
                            estimated_time: metaData.estimated_time,
                            available: metaData.available,
                            content_location: rawUrl,
                        },
                    });
                    console.log(
                        `Created learning object: ${newLO.hruid} in language ${newLO.language} with id: ${newLO.id}`
                    );
                } else {
                    assert(
                        existingLearningObjects.length === 1,
                        "There should be only one learning object with the same hruid and language"
                    ); // TODO: unique constraint in DB?
                    node._id = existingLearningObjects[0].id; // set the id of the learning object to the one in the DB // TODO: this means Dwengo's supplied _id is utterly useless!
                    console.log(
                        `Learning object ${node.learningobject_hruid} already exists, skipping.`
                    );
                }

                // add the node of the current learning path that has the value of the above learning object
                const newNode = await prisma.learningPathNode.create({
                    data: {
                        // id: node._id, // wordt automatisch aangemaakt (auto-increment) en dat is juist want kunt niet zelfde id gebruiken als bijhorende learningobject omdat één leerobject value kan zijn van meerdere nodes
                        learning_object_id: node._id,
                        learning_path_id: lp._id,
                        start_node: node.start_node || false,
                    },
                });
                console.log(
                    `Created learning path node with id: ${newNode.id}`
                );

                console.log(
                    `setting nodeMap with key ${
                        node.learningobject_hruid + node.language
                    } and value ${newNode.id}`
                );
                nodeMap.set(
                    node.learningobject_hruid + "+" + node.language,
                    newNode.id
                ); // map learning object hruid+lang to learning path node id
            }

            // add all transitions
            for (const node of lp.nodes) {
                if (node.transitions && Array.isArray(node.transitions)) {
                    for (const transition of node.transitions) {
                        console.log("printing nodemap");
                        for (const [key, value] of nodeMap.entries()) {
                            console.log(key + " -> " + value);
                        }
                        if (
                            transition.next.hruid === "zpn_voorkennisparameter"
                        ) {
                            transition.next.hruid = "pn_parameterrechte";
                        }
                        if (
                            transition.next._id === "67e51a1e531d59ac3765abb2" // dit object heeft transition.next.hruid === "leerlijn_intro_leerplandoelen" en transition.next.language === "nl"
                        ) {
                            transition.next.hruid =
                                "leerlijn_grafisch_tekstueel_leerplandoelen";
                        }
                        console.log(
                            "trying key " +
                                transition.next.hruid +
                                "+" +
                                transition.next.language
                        );

                        const destinationNodeId = nodeMap.get(
                            transition.next.hruid +
                                "+" +
                                transition.next.language
                        ); // Get the destination node ID from the map
                        if (destinationNodeId === undefined) {
                            throw new Error(
                                `Destination node with id ${transition.next.hruid} and language ${transition.next.language} not found in nodeMap!`
                            );
                        }

                        const newTransition = await prisma.transition.create({
                            data: {
                                condition_min: transition.condition_min || -1,
                                condition_max: transition.condition_max || -1,
                                source_node_id: nodeMap.get(
                                    `${transition.next.hruid}+${transition.next.language}`
                                ), // Get the source node ID from the map
                                destination_node_id: destinationNodeId,
                            },
                        });
                        console.log(
                            `Created transition with id: ${newTransition.id}`
                        );
                    }
                }
            }
        }
        // break; // TODO: remove this line to process all learning paths
    }
}

createLearningPaths()
    .then(() => {
        console.log("All learning paths created.");
        process.exit(0);
    })
    .catch((error) => {
        console.error("Error creating learning paths:", error);
        process.exit(1);
    });
