import {Request, Response} from "express";
import {JsonLeerlingObject} from "../../json_objecten.ts";
import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

export async function leerling(req: Request, res: Response) {

    res.send(new JsonLeerlingObject());
    res.status(501);
}

export async function verwijder_leerling(req: Request, res: Response) {
    //todo: auth
    prisma.student.delete(
        {
            where: {
                id: 0
            }
        }
    );
    res.status(501);
}
