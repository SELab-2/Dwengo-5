import {Request, Response} from "express";
import {JsonLeerlingObject} from "../../json_objecten.ts";
import { Prisma, PrismaClient } from '@prisma/client'

export function maak_leerling(req: Request, res: Response) {

    res.status(501);
}

export function leerling(req: Request, res: Response) {
    res.send(new JsonLeerlingObject());
    res.status(501);
}

export function verwijder_leerling(req: Request, res: Response) {
    res.status(501);
}
