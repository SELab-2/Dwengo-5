import {Request, Response} from "express";
import {JsonLeerlingObject} from "../../json_objecten.ts";
import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

export async function leerling(req: Request, res: Response) {

    res.send(new JsonLeerlingObject());
    res.status(501);
}

export async function verwijder_leerling(req: Request, res: Response) {
    try {
        //todo: auth
        let leerling_id_string: string = req.params.leerling_id;
        let leerling_id: number = Number(leerling_id_string);
        const leerling = prisma.student.findUnique({
            where: {
                id: leerling_id
            }
        });
        if (!leerling) {
            res.status(404).send({error: "leerling niet gevonden"});
        }
        prisma.student.delete({
            where: {
                id: leerling_id
            }
        });
        res.status(200).send();
    } catch (e) {
        res.status(500).send({error: "interne fout"})
    }
}
