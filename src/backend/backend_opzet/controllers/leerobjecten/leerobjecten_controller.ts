import {Request, Response} from "express";
import {JsonMdObject} from "../../json_objecten.ts";

export function leerobject(req: Request, res: Response){
    res.status(501);
}

export function leerobject_inhoud(req: Request, res: Response){
    res.send(new JsonMdObject());
    res.status(501);
}
