import {NextFunction, Request, Response} from "express";
import {prisma} from "../../index.ts";
import {ExpressException} from "../../exceptions/ExpressException.ts";

// GET /leerpaden?language
export async function leerpaden(req: Request, res: Response) {
    const language: string = req.body.language;
    const learningPaths = await prisma.learningPath.findMany({
        where: {language: language},
    });
    const learningPathLinks = learningPaths.map(id => `/leerpaden/${id.uuid}`);
    res.status(200).send({leerpaden: learningPathLinks});
}

// GET /leerpaden/:leerpad_id
export async function leerpad(req: Request, res: Response, next: NextFunction) {
    const learningobjectId = req.params.leerpad_id;
    const learningPath = await prisma.learningPath.findUnique({
        where: {uuid: learningobjectId}
    });
    if (!learningPath) throw new ExpressException(404, "learningPath not found", next);

    res.status(200).send({
        name: learningPath.uuid,
        image: learningPath.image,
        description: "",
        content: `/leerpaden/${learningPath.uuid}/inhoud`
    });
}

// GET /leerpaden/:leerpad_id/inhoud
export async function leerpad_inhoud(req: Request, res: Response, next: NextFunction) {
    const learningPathtId = req.params.leerpad_id;
    const learningPath = await prisma.learningPath.findUnique({
        where: {uuid: learningPathtId}
    });

    if (!learningPath) throw new ExpressException(404, "learningPath not found", next);

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
