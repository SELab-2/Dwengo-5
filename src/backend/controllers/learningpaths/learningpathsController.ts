import {NextFunction, Request, Response} from "express";
import {prisma} from "../../index.ts";
import {ExpressException, throwExpressException} from "../../exceptions/ExpressException.ts";
import {z} from "zod";
import {learningobjectLink, learningpathLink} from "../../help/links.ts";

export async function   getLearningpaths(req: Request, res: Response, next: NextFunction) {
    const language = z.string().safeParse(req.query.language);
    if (!language.success) return throwExpressException(400, "invalid language", next);

    const learningpaths = await prisma.learningPath.findMany({
        where: {language: language.data}
    });
    const learningpathLinks = learningpaths.map(learningpath => learningpathLink(learningpath.id));
    res.status(200).send({learningpaths: learningpathLinks});
}

export async function getLearningpath(req: Request, res: Response, next: NextFunction) {
    const learningobjectId = z.string().safeParse(req.params.learningpathId);
    if (!learningobjectId.success) return throwExpressException(400, "invalid learningpathId", next);

    const learningpath = await prisma.learningPath.findUnique({
        where: {id: learningobjectId.data}
    });
    if (!learningpath) return throwExpressException(404, "learningpath not found", next);

    res.status(200).send({
        name: learningpath.title,
        image: learningpath.image,
        description: learningpath.description,
        links: {
            content: req.originalUrl + "/content"
        }
    });
}

export async function postLearningpath(req: Request, res: Response, next: NextFunction){
    const learningpathTitle = z.string().safeParse(req.body.title);
    const learningpathDescription = z.string().safeParse(req.body.description);
    const learningpathLanguage = z.string().safeParse(req.body.language);
    if (!learningpathLanguage.success) return throwExpressException(400, "invalid language", next);
    if (!learningpathDescription.success) return throwExpressException(400, "invalid description", next);
    if (!learningpathTitle.success) return throwExpressException(400, "invalid title", next);

    await prisma.learningPath.create({
        data: {
            title: learningpathTitle.data,           
            language: learningpathLanguage.data,     
            description: learningpathDescription.data,
            id: learningpathTitle.data,              
            hruid: learningpathTitle.data,
        }
    });
    res.status(200).send();
}

export async function getLearningpathContent(req: Request, res: Response, next: NextFunction) {
    const learningpathtId = z.string().safeParse(req.params.learningpathId);
    if (!learningpathtId.success) return throwExpressException(400, "invalid learningpathtId", next);

    const learningPath = await prisma.learningPath.findUnique({
        where: {id: learningpathtId.data},
        include: {
            learning_path_nodes: {
                include: {
                    outgoing_edges: {
                        include: {
                            destination_node: true
                        }
                    }
                }
            }
        }
    });
    if (!learningPath) return throwExpressException(404, "learningpath not found", next);

    const learningPathNodes = learningPath.learning_path_nodes.map(node => {
        return {
            learningObject: learningobjectLink(node.learning_object_id),
            isStartNode: node.start_node,
            next: node.outgoing_edges.map(transition => {
                if (transition.destination_node_id != null) return {
                    link: learningobjectLink(transition.destination_node.learning_object_id),
                    condition: [transition.condition_min, transition.condition_max]
                }
            }).filter(learningobject => learningobject != undefined)
        }
    });

    res.status(200).send({learningPath: learningPathNodes});
}

export async function postLearningpathContent(req: Request, res: Response, next: NextFunction): Promise<any> {
    const { learningpathId } = req.params;
    const { nodes, transitions, startNode } = req.body as {
        nodes: string[];
        transitions: {
            label: string;
            source: string;
            target: string;
            min_score: number;
            max_score: number;
        }[];
        startNode: string;
    };

    try {
        // Step 1: Delete existing transitions and nodes
        const existingNodes = await prisma.learningPathNode.findMany({
            where: { learning_path_id: learningpathId },
            select: { id: true }
        });

        const existingNodeIds = existingNodes.map(n => n.id);

        // Delete all transitions where either source or destination is in the existing node list
        await prisma.transition.deleteMany({
            where: {
                OR: [
                    { source_node_id: { in: existingNodeIds } },
                    { destination_node_id: { in: existingNodeIds } }
                ]
            }
        });

        // Delete the learning path nodes
        await prisma.learningPathNode.deleteMany({
            where: { id: { in: existingNodeIds } }
        });

        // Step 2: Create new LearningPathNodes
        const createdNodes = await Promise.all(
            nodes.map((learning_object_id) =>
                prisma.learningPathNode.create({
                    data: {
                        learning_object_id,
                        learning_path_id: learningpathId,
                        start_node: learning_object_id === startNode,
                    }
                })
            )
        );

        // Step 3: Map LearningObject ID to new Node ID
        const loIdToNodeId = Object.fromEntries(
            createdNodes.map((n) => [n.learning_object_id, n.id])
        );

        // Step 4: Create transitions
        await Promise.all(
            transitions.map((t) =>
                prisma.transition.create({
                    data: {
                        condition_min: t.min_score,
                        condition_max: t.max_score,
                        source_node_id: loIdToNodeId[t.source],
                        destination_node_id: loIdToNodeId[t.target],
                    }
                })
            )
        );

        res.status(200).json({ message: "Learning path content created successfully" });

    } catch (error) {
        console.error("Error creating learningpath content:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}