import {NextFunction, Request, Response} from "express";

export async function getWaitingroom(req: Request, res: Response, next: NextFunction) {
    res.send({
        links: {
            students: req.originalUrl + "/students",
            teachers: req.originalUrl + "/teachers",
        }
    })
}