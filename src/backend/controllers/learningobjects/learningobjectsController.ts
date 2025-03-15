import {NextFunction, Request, Response} from "express";
import {prisma} from "../../index.ts";
import {throwExpressException} from "../../exceptions/ExpressException.ts";
import {z} from "zod";
import {learningobjectLink} from "../../help/links.ts";

export async function getLearningObject(req: Request, res: Response, next: NextFunction) {
    const learningObjectId = z.string().safeParse(req.params.learningObjectId);
    if (!learningObjectId.success) return throwExpressException(400, "invalid learningObjectId", next);

    const learningObject = await prisma.learningObject.findUnique({
        where: {id: learningObjectId.data},
        include: {
            learning_objects_metadata: true
        }
    });
    if (!learningObject) return throwExpressException(404, "learningObject not found", next);

    res.status(200).send({
        name: learningObject.hruid,
        estimated_time: learningObject.learning_objects_metadata ? learningObject.learning_objects_metadata.estimated_time : -1,//todo: wachten tot metadata niet meer optioneel is in db
        content: learningobjectLink(learningObject.uuid) + "/content",
    });
}

export async function getLearningobjectContent(req: Request, res: Response, next: NextFunction) {
    const learningobjectId = z.string().safeParse(req.params.learningObjectId);
    if (!learningobjectId.success) return throwExpressException(400, "invalud learningobjectId", next);

    const learningObject = await prisma.learningObject.findUnique({
        where: {id: learningobjectId.data}
    });
    if (!learningObject) return throwExpressException(404, "learningObject not found", next);

    res.status(200).send({htmlContent: learningObject.html_content});
}
