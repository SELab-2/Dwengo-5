import {Request, Response} from "express";
import {JsonLeerkrachtObject} from "../../json_objecten.ts";

export function maak_leerkracht(req: Request, res: Response) {
    res.send(new JsonLeerkrachtObject());
    res.status(501);
}

export function verwijder_leerkracht(req: Request, res: Response) {
    res.status(501);
}
