import {Request, Response} from "express";
import {prisma} from "../../index.ts";
import {ExpressException} from "../../exceptions/ExpressException.ts";

export async function leerobject(req: Request, res: Response) {
    const learningObjectId: string = req.params.leerling_id;
    const learningObject = await prisma.learningObject.findUnique({
        where: {
            id: learningObjectId
        }
    });
    if (!learningObject) throw new ExpressException(404, "learningObject not found");
    res.status(200).send({
        name: learningObject.hruid,
        estimated_time: 0,
        content: `leerobjecten/${learningObjectId}/inhoud`
    });
}

export async function leerobject_inhoud(req: Request, res: Response) {
    const learningObjectId: string = req.params.leerling_id;
    const learningObject = await prisma.learningObject.findUnique({
        where: {
            id: learningObjectId
        }
    });
    if (!learningObject) throw new ExpressException(404, "learningObject not found");

    res.status(200).send({htmlContent: learningObject.html_content});
}
