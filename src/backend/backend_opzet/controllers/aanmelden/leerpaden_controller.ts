import {Request, Response} from "express";

export function leerpaden(req: Request, res: Response) {
    // const taal:string = req.query.taal;
    res.status(501).send();
}

export function leerpad(req: Request, res: Response) {
    res.status(501);
}

export function leerpad_inhoud(req: Request, res: Response) {
    res.status(501);
}
