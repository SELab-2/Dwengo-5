import { NextFunction, Request, Response } from "express";
import { prisma } from "../../index.ts";
import { z } from "zod"
import { throwExpressException } from "../../exceptions/ExpressException.ts";
import {
    doesTokenBelongToStudentInClass,
    doesTokenBelongToTeacher,
    doesTokenBelongToTeacherInClass,
    getJWToken
} from "../authentication/extraAuthentication.ts";
import { zUserLink } from "../../help/validation.ts";
import { classLink, splitId } from "../../help/links.ts";

export async function getClass(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    if (!classId.success) return throwExpressException(400, "invalid classId", next);

    const JWToken = getJWToken(req);
    if (!JWToken) return throwExpressException(401, 'no token sent', next);

    const classroom = await prisma.class.findUnique({
        where: { id: classId.data }
    });
    if (!classroom) return throwExpressException(404, "class not found", next);

    res.status(200).send({
        name: classroom.name,
        links: {
            students: req.originalUrl + "/users",
            teachers: req.originalUrl + "/teachers",
            info: req.originalUrl + "/info",
            assignments: req.originalUrl + "/assignments",
            conversations: req.originalUrl + "/conversations"
        }
    });
}

export async function postClass(req: Request, res: Response, next: NextFunction) {
    const name = z.string().safeParse(req.body.name);
    const teacherLink = zUserLink.safeParse(req.body.teacher);

    if (!name.success) return throwExpressException(400, "invalid name", next);
    if (!teacherLink.success) return throwExpressException(400, "invalid teacher", next);

    const JWToken = getJWToken(req);
    if (!JWToken) return throwExpressException(401, 'no token sent', next);
    const auth1 = await doesTokenBelongToTeacher(splitId(teacherLink.data), JWToken);
    if (!auth1.success) return throwExpressException(auth1.errorCode, auth1.errorMessage, next);

    //teacher exist check done by auth

    const classroom = await prisma.class.create({
        data: {
            name: name.data,
            class_users: { create: { user_id: splitId(teacherLink.data) } }
        }
    });
    res.status(200).send({ classroom: classLink(classroom.id) });
}

export async function deleteClass(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    if (!classId.success) return throwExpressException(400, "invalid classId", next);

    const JWToken = getJWToken(req);
    if (!JWToken) return throwExpressException(401, 'no token sent', next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    if (!auth1.success) return throwExpressException(auth1.errorCode, auth1.errorMessage, next);

    //class exist check done by auth

    await prisma.$transaction([
        prisma.class.deleteMany({
            where: { id: classId.data }
        })
    ]);
    res.status(200).send();
}

export async function patchClass(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const name = z.string().safeParse(req.body.name);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!name.success) return throwExpressException(400, "invalid name", next);

    const JWToken = getJWToken(req);
    if (!JWToken) return throwExpressException(401, 'no token sent', next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    if (!auth1.success) return throwExpressException(auth1.errorCode, auth1.errorMessage, next);

    //class exist check done by auth

    await prisma.$transaction([
        prisma.class.update({
            where: { id: classId.data },
            data: { name: name.data }
        })
    ]);
    res.status(200).send();
}
