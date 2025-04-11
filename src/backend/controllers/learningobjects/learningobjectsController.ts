import {NextFunction, Request, Response} from "express";
import {prisma} from "../../index.ts";
import {throwExpressException} from "../../exceptions/ExpressException.ts";
import {z} from "zod";

export async function getLearningObject(req: Request, res: Response, next: NextFunction) {
    const learningObjectId = z.string().safeParse(req.params.learningObjectId);
    if (!learningObjectId.success) return throwExpressException(400, "invalid learningObjectId", next);

    const learningobject = await prisma.learningObject.findUnique({
        where: {id: learningObjectId.data}
    });
    if (!learningobject) return throwExpressException(404, "learningObject not found", next);

    res.status(200).send({
        name: learningobject.hruid,
        estimated_time: learningobject.estimated_time,
        links: {
            content: req.originalUrl + "/content"
        }
    });
}

export async function getLearningobjectContent(req: Request, res: Response, next: NextFunction) {
    const learningObjectId = z.string().safeParse(req.params.learningObjectId);
    if (!learningObjectId.success) return throwExpressException(400, "invalid learningObjectId", next);

    const learningobject = await prisma.learningObject.findUnique({
        where: {id: learningObjectId.data}
    });
    if (!learningobject) return throwExpressException(404, "learningObject not found", next);

    res.status(200).send({htmlContent: learningobject.html_content});
}
