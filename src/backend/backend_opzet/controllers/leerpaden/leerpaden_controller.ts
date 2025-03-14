import {NextFunction, Request, Response} from "express";
import {prisma} from "../../index.ts";
import {throwExpressException} from "../../exceptions/ExpressException.ts";
import {z} from "zod";

// GET /leerpaden?language
export async function leerpaden(req: Request, res: Response, next: NextFunction) {
    const language = z.string().safeParse(req.query.taal);
    if (!language.success) return throwExpressException(400, "invalid language", next);

    const learningPaths = await prisma.learningPath.findMany({
        where: {language: language.data},
    });
    console.log(learningPaths);
    const learningPaths2 = await prisma.learningPath.findMany({
    });
    console.log(learningPaths2);
    const learningPathLinks = learningPaths.map(id => `/leerpaden/${id.uuid}`);
    res.status(200).send({leerpaden: learningPathLinks});
}

// GET /leerpaden/:leerpad_id
export async function leerpad(req: Request, res: Response, next: NextFunction) {
    const learningobjectId = z.string().safeParse(req.params.leerpad_id);
    if (!learningobjectId.success) return throwExpressException(404, "invalid learningobjectId", next);

    const learningPath = await prisma.learningPath.findUnique({
        where: {uuid: learningobjectId.data}
    });
    if (!learningPath) return throwExpressException(404, "learningPath not found", next);

    res.status(200).send({
        name: learningPath.uuid,
        image: learningPath.image,
        description: "",
        content: `/leerpaden/${learningPath.uuid}/inhoud`
    });
}

// GET /leerpaden/:leerpad_id/inhoud
export async function leerpadInhoud(req: Request, res: Response, next: NextFunction) {
    const learningPathtId = z.string().safeParse(req.params.leerpad_id);
    if (!learningPathtId.success) return throwExpressException(400, "invalid learningPathtId", next);

    const learningPath = await prisma.learningPath.findUnique({
        where: {uuid: learningPathtId.data}
    });
    if (!learningPath) return throwExpressException(404, "learningPath not found", next);

    //todo: dit zou ik toch eens moeten testen denk ik
    const learningObjects = await prisma.learningObject.findMany({
        where: {
            learning_paths_learning_objects: {
                some: {
                    learning_paths_uuid: "550e8400-e29b-41d4-a716-446655440001"
                }
            }
        },
        include: {
            learning_path_nodes: {
                where: {
                    learning_paths: {
                        uuid: "550e8400-e29b-41d4-a716-446655440001"
                    }
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
    const learningObjectsList = learningObjects.map(learningObject => {
        return {
            learningobject: `/leerobjecten/${learningObject.uuid}`,
            isNext: learningObject.learning_path_nodes[0].start_node,
            next: learningObject.learning_path_nodes[0].transitions_transitions_nextTolearning_path_nodes.map(transition => {
                if (transition.next_learning_path_node != null) return {
                    next: `/leerobjecten/${transition.next_learning_path_node.learning_objects.uuid}`,
                    condition: transition.condition
                }
            }).filter(learningObject => learningObject != undefined)
        }
    });
    res.status(200).send(learningObjectsList);
}
