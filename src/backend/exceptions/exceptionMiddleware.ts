import { NextFunction, Request, Response } from "express";
import { ExpressException } from "./ExpressException.ts";

export function exceptionHandler(
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    if (err instanceof ExpressException) {
        res.status(err.status).send({ error: err.message });
    } else {
        console.error(err);
        res.status(500).send({ error: "internal error" });
    }
}
