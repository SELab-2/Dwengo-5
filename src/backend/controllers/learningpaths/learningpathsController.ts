import {NextFunction, Request, Response} from "express";
import {prisma} from "../../index.ts";
import {throwExpressException} from "../../exceptions/ExpressException.ts";
import {z} from "zod";

export async function getLearningpaths(req: Request, res: Response, next: NextFunction) {
    const language = z.string().safeParse(req.query.taal);
    if (!language.success) return throwExpressException(400, "invalid language", next);

    const learningPaths = await prisma.learningPath.findMany({
        where: {language: language.data},
    });
    const learningPathLinks = learningPaths.map(learningpath => `/leerpaden/${learningpath.uuid}`);
    res.status(200).send({learningpaths: learningPathLinks});
}

export async function getLearningpath(req: Request, res: Response, next: NextFunction) {
    const learningobjectId = z.string().safeParse(req.params.learninpathId);
    if (!learningobjectId.success) return throwExpressException(404, "invalid learningobjectId", next);

    const learningPath = await prisma.learningPath.findUnique({
        where: {uuid: learningobjectId.data}
    });
    if (!learningPath) return throwExpressException(404, "learningpath not found", next);

    res.status(200).send({
        name: learningPath.uuid,
        image: learningPath.image,
        description: learningPath.description,
        content: `/leerpaden/${learningPath.uuid}/content`
    });
}

export async function getLearningpathContent(req: Request, res: Response, next: NextFunction) {
    const learningPathtId = z.string().safeParse(req.params.learninpathId);
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
                    learning_paths_uuid: learningPathtId.data
                }
            }
        },
        include: {
            learning_path_nodes: {
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
