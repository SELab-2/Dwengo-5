import {Request, Response} from "express";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export async function leerkracht(req: Request, res: Response) {
    try {
        //todo: auth
        let leerkracht_id_string: string = req.params.leerkracht_id;
        let leerkracht_id: number = Number(leerkracht_id_string);
        if (isNaN(leerkracht_id)) {
            res.status(400).send({error: "geen geldige leerkracht_id"});
            return;
        }
        const leerkracht = await prisma.teacher.findUnique({
            where: {
                id: leerkracht_id
            }
        });
        if (!leerkracht) {
            res.status(404).send({error: "leerkracht niet gevonden"});
            return;
        }
        res.status(200).send({naam: leerkracht.username});
    } catch (e) {
        res.status(500).send({error: "interne fout"})
    }
}

export async function verwijder_leerkracht(req: Request, res: Response) {
    try {
        //todo: auth
        let leerkracht_id_string: string = req.params.leerkracht_id;
        let leerkracht_id: number = Number(leerkracht_id_string);
        if (isNaN(leerkracht_id)) {
            res.status(400).send({error: "geen geldige leerkracht_id"});
            return;
        }
        const leerkracht = await prisma.teacher.findUnique({
            where: {
                id: leerkracht_id
            }
        });
        if (!leerkracht) {
            res.status(404).send({error: "leerkracht niet gevonden"});
            return;
        }
        await prisma.teacher.delete({
            where: {
                id: leerkracht_id
            }
        });
        res.status(200).send();
    } catch (e) {
        res.status(500).send({error: "interne fout"})
    }
}
