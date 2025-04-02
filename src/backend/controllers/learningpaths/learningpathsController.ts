import {NextFunction, Request, Response} from "express";
import {prisma} from "../../index.ts";
import {throwExpressException} from "../../exceptions/ExpressException.ts";
import {z} from "zod";
import {learningobjectLink, learningpathLink} from "../../help/links.ts";

export async function   getLearningpaths(req: Request, res: Response, next: NextFunction) {
    const language = z.string().safeParse(req.query.language);
    if (!language.success) return throwExpressException(400, "invalid language", next);

    const learningpaths = await prisma.learningPath.findMany({
        where: {language: language.data},
    });
    const learningpathLinks = learningpaths.map(learningpath => learningpathLink(learningpath.uuid));
    res.status(200).send({learningpaths: learningpathLinks});
}

export async function getLearningpath(req: Request, res: Response, next: NextFunction) {
    const learningobjectId = z.string().safeParse(req.params.learningpathId);
    if (!learningobjectId.success) return throwExpressException(400, "invalid learningobjectId", next);

    const learningpath = await prisma.learningPath.findUnique({
        where: {uuid: learningobjectId.data}
    });
    if (!learningpath) return throwExpressException(404, "learning path not found", next);

    res.status(200).send({
        name: learningpath.hruid,
        image: learningpath.image,
        description: learningpath.description,
        links: {
            content: req.originalUrl + "/content"
        }
    });
}

export async function getLearningpathContent(req: Request, res: Response, next: NextFunction) {
    const learningpathtId = z.string().safeParse(req.params.learningpathId);
    if (!learningpathtId.success) return throwExpressException(400, "invalid learningpathtId", next);

    const learningpath = await prisma.learningPath.findUnique({
        where: {uuid: learningpathtId.data}
    });
    if (!learningpath) return throwExpressException(404, "learningpath not found", next);

    //todo: dit zou ik toch eens moeten testen denk ik
    const learningobjects = await prisma.learningObject.findMany({
        where: {
            learning_paths_learning_objects: {
                some: {
                    learning_paths_uuid: learningpathtId.data
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
    const learningobjectsList = learningobjects.map(learningobject => {
        return {
            learningobject: learningobjectLink(learningobject.uuid),
            isNext: learningobject.learning_path_nodes[0].start_node,
            next: learningobject.learning_path_nodes[0].transitions_transitions_nextTolearning_path_nodes.map(transition => {
                if (transition.next_learning_path_node != null) return {
                    next: learningobjectLink(transition.next_learning_path_node.learning_objects.uuid),
                    condition: transition.condition
                }
            }).filter(learningobject => learningobject != undefined)
        }
    });
    res.status(200).send(learningobjectsList);
}
