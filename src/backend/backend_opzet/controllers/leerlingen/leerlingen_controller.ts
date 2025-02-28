import {Request, Response} from "express";
import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

export async function leerling(req: Request, res: Response) {
    try {
        //todo: auth
        let leerling_id_string: string = req.params.leerling_id;
        let leerling_id: number = Number(leerling_id_string);
        if (isNaN(leerling_id)) {
            res.status(400).send({error: "geen geldige leerling_id"});
            return;
        }
        const leerling = await prisma.student.findUnique({
            where: {
                id: leerling_id
            }
        });
        if (!leerling) {
            res.status(404).send({error: "leerling niet gevonden"});
            return;
        }
        res.status(200).send({name: leerling.username});
    } catch (e) {
        res.status(500).send({error: "interne fout"})
    }

}

export async function verwijder_leerling(req: Request, res: Response) {
    try {
        //todo: auth
        let leerling_id_string: string = req.params.leerling_id;
        let leerling_id: number = Number(leerling_id_string);
        if (isNaN(leerling_id)) {
            res.status(400).send({error: "geen geldige leerling_id"});
            return;
        }
        const leerling = await prisma.student.findUnique({
            where: {
                id: leerling_id
            }
        });
        if (!leerling) {
            res.status(404).send({error: "leerling niet gevonden"});
            return;
        }
        await prisma.student.delete({
            where: {
                id: leerling_id
            }
        });
        res.status(200).send();
    } catch (e) {
        res.status(500).send({error: "interne fout"})
    }
}
