import {NextFunction, Request, Response} from "express";
import {prisma} from "../../../../index.ts";
import {z} from "zod"
import {throwExpressException} from "../../../../exceptions/ExpressException.ts";
import {
    doesTokenBelongToStudentInClass,
    doesTokenBelongToTeacher,
    doesTokenBelongToTeacherInClass,
    getJWToken,
} from "../../../authentication/extraAuthentication.ts";
import {zTeacherLink} from "../../../../help/validation.ts";
import {splitId} from "../../../../help/links.ts";

export async function getWaitingroomTeacher(req: Request, res: Response, next: NextFunction) {
}

export async function postWaitingroomTeacher(req: Request, res: Response, next: NextFunction) {
}

export async function patchWaitingroomTeacher(req: Request, res: Response, next: NextFunction) {
}

export async function deleteWaitingroomTeacher(req: Request, res: Response, next: NextFunction) {
}