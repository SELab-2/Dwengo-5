import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { throwExpressException } from "../../../exceptions/ExpressException.ts";
import { prisma } from "../../../index.ts";
import {
    doesTokenBelongToStudentInClass,
    doesTokenBelongToTeacherInClass,
    getJWToken
} from "../../authentication/extraAuthentication.ts";
import { userLink } from "../../../help/links.ts";

export async function getClassTeachers(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    if (!classId.success) return throwExpressException(400, "invalid classId", next);

    const JWToken = getJWToken(req);
    if (!JWToken) return throwExpressException(401, 'no token sent', next);

    const classroom = await prisma.class.findUnique({
        where: { id: classId.data }
    });
    if (!classroom) return throwExpressException(404, "class not found", next);

    const teachers = await prisma.classUser.findMany({
        where: {
            class_id: classId.data,
            user: { teacher: { some: {} } }
        }
    });
    const teacherLinks = teachers.map(teacher => userLink(teacher.user_id));
    res.status(200).send({ teachers: teacherLinks });
}

export async function deleteClassTeacher(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const teacherId = z.coerce.number().safeParse(req.params.teacherId);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!teacherId.success) return throwExpressException(400, "invalid teacherId", next);

    const JWToken = getJWToken(req);
    if (!JWToken) return throwExpressException(401, 'no token sent', next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    if (!auth1.success) return throwExpressException(auth1.errorCode, auth1.errorMessage, next);

    //no class or teacher exist checks needed because auth already does this

    await prisma.$transaction([
        prisma.classUser.deleteMany({
            where: {
                class_id: classId.data,
                user_id: teacherId.data
            }
        }),
        prisma.class.deleteMany({
            where: {
                id: classId.data,
                class_users: { none: { user: { teacher: {} } } }
            }
        })
    ]);
    res.status(200).send();
}
