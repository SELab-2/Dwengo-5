import {NextFunction, Request, Response} from "express";
import {prisma} from "../../index.ts";
import {throwExpressException} from "../../exceptions/ExpressException.ts";

export async function getLearningObject(req: Request, res: Response, next: NextFunction) {
    const learningObjectId: string = req.params.learningObjectId;
    const learningObject = await prisma.learningObject.findUnique({
        where: {
            id: learningObjectId,
        },
    });
    if (!learningObject)
        return throwExpressException(404, "learningObject not found", next);

    res.status(200).send({
        name: learningObject.hruid,
        estimated_time: 0,
        content: `/leerobjecten/${learningObjectId}/content`,
    });
}

export async function getLearningobjectContent(req: Request, res: Response, next: NextFunction) {
    const learningObjectId: string = req.params.learningObjectId;
    const learningObject = await prisma.learningObject.findUnique({
        where: {
            id: learningObjectId,
        },
    });
    if (!learningObject)
        return throwExpressException(404, "learningObject not found", next);

    res.status(200).send({htmlContent: learningObject.html_content});
}
