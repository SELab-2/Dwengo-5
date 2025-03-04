import {Request, Response} from "express";
import {prisma} from "../../index.ts";

export async function leerpaden(req: Request, res: Response) {
    try {
        let language: string = req.params.leerling_id;
        const learningPaths = await prisma.learningPath.findMany({
            where: {
                language: language
            },
            select: {
                uuid: true
            }
        });
        let learningPathLinks = learningPaths.map(id => `leerpaden/${id.uuid}`);
        res.status(200).send(learningPathLinks);
    } catch (e) {
        res.status(500).send({error: "interne fout"})
    }
}

export async function leerpad(req: Request, res: Response) {
    try {
        let learningobjectId = req.params.leerpad_id;
        const learningPath = await prisma.learningPath.findUnique({
            where: {
                uuid: learningobjectId
            },
        });
        if (!learningPath) {
            res.status(404).send("learningPath not found");
            return;
        }
        res.status(200).send({
            name: learningPath.uuid,
            image: learningPath.image,
            description: "",
            content: `/leerpaden/${learningPath.uuid}/inhoud`
        });
    } catch (e) {
        res.status(500).send({error: "interne fout"})
    }
}

export async function leerpad_inhoud(req: Request, res: Response) {
    try {
        let learningPathtId = req.params.leerpad_id;
        const learningPath = await prisma.learningPath.findUnique({
            where: {
                uuid: learningPathtId
            },
        });
        if (!learningPath) {
            res.status(404).send("learningPath not found");
            return;
        }
        //todo: dit zou ik toch eens moeten testen denk ik
        const learningObjects = await prisma.learningObject.findMany({
            where: {
                learning_paths_learning_objects: {
                    some: {
                        learning_paths_uuid: learningPathtId,
                    }
                }
            },
            include: {
                learning_path_nodes: {
                    where: {
                        learning_paths: {
                            uuid: learningPathtId
                        }
                    },
                    select: {
                        start_node: true
                    },
                    include: {
                        transitions_transitions_nextTolearning_path_nodes: {
                            select: {
                                condition: true,
                                next_learning_path_node: {
                                    select: {
                                        learning_objects: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        let learningObjectsList = learningObjects.map(learningObject => {
            return {
                learningobject: `/leerobjecten/${learningObject.uuid}`,
                isNext: learningObject.learning_path_nodes[0].start_node,
                next: learningObject.learning_path_nodes[0].transitions_transitions_nextTolearning_path_nodes.map(transition => {
                    if (transition.next_learning_path_node != null) return {
                        next: `leerobjecten/${transition.next_learning_path_node.learning_objects.uuid}`,
                        condition: transition.condition
                    }
                }).filter(learningObject => learningObject != undefined)
            }
        });
        res.status(200).send(learningObjectsList);
    } catch (e) {
        res.status(500).send({error: "interne fout"})
    }
}
