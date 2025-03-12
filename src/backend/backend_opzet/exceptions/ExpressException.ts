import {NextFunction} from "express";

export class ExpressException extends Error {
    status;

    constructor(status: number, message: string, next: NextFunction) {
        super(message);
        this.status = status;
        next(this);
    }
}