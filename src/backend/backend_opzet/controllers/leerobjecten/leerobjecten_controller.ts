import {Request, Response} from "express";
import {z, ZodError} from "zod"
import {prisma} from "../../index.ts";

export async function leerobject(req: Request, res: Response) {
    try {
        let learningObjectId: string = req.params.leerling_id;
        try {
            let leerling_id: number = z.number().parse(learningObjectId);
        } catch (e) {
            if (e instanceof ZodError) res.status(400).send({error: "non conforming learningObjectId"});
        }
        const learningObject = await prisma.learningObject.findUnique({
            where: {
                id: learningObjectId
            }
        });
        if (!learningObject) {
            res.status(404).send({error: "learningObject not found"});
            return;
        }
        res.status(200).send({
            name: learningObject.hruid,
            estimated_time: 0,
            content: `leerobjecten/${learningObjectId}/inhoud`
        });
    } catch (e) {
        res.status(500).send({error: "interne fout"})
    }
}

export async function leerobject_inhoud(req: Request, res: Response) {
    try {
        let learningObjectId: string = req.params.leerling_id;
        try {
            let leerling_id: number = z.number().parse(learningObjectId);
        } catch (e) {
            if (e instanceof ZodError) res.status(400).send({error: "non conforming learningObjectId"});
        }
        const learningObject = await prisma.learningObject.findUnique({
            where: {
                id: learningObjectId
            }
        });
        if (!learningObject) {
            res.status(404).send({error: "learningObject not found"});
            return;
        }
        res.status(200).send({htmlContent: learningObject.html_content});
    } catch (e) {
        res.status(500).send({error: "interne fout"})
    }

}
