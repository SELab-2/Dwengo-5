import {NextFunction} from "express";

export function throwExpressException(status: number, message: string, next: NextFunction):void{
    new ExpressException(status, message, next);
    return;
}

export class ExpressException extends Error {
    status;

    constructor(status: number, message: string, next: NextFunction) {
        super(message);
        this.status = status;
        next(this);
    }
}