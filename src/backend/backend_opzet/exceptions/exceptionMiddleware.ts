import {Request, Response} from "express"
import {ExpressException} from "./ExpressException.ts";

export function exceptionHandler(err: Error, req: Request, res: Response, next: any) {
    if (err instanceof ExpressException) res.status(err.status).send({error: err.message});
    else res.status(500).send({error: "internal error"});
}