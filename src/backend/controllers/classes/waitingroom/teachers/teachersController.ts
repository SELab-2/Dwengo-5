import {NextFunction, Request, Response} from "express";
import {z} from "zod";
import {zTeacherLink} from "../../../../help/validation.ts";
import {throwExpressException} from "../../../../exceptions/ExpressException.ts";
import {
    doesTokenBelongToTeacher,
    doesTokenBelongToTeacherInClass,
    getJWToken
} from "../../../authentication/extraAuthentication.ts";
import {prisma} from "../../../../index.ts";
import {splitId, teacherLink} from "../../../../help/links.ts";

export async function getWaitingroomTeachers(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    if (!classId.success) return throwExpressException(400, "invalid classId", next);

    const JWToken = getJWToken(req, next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    if (!auth1.success) return throwExpressException(auth1.errorCode, auth1.errorMessage, next);

    const teachers = await prisma.waitingroomTeacher.findMany({
        where: {classes_id: classId.data}
    })

    const teacherLinks = teachers.map(teacher => teacherLink(teacher.teachers_id));
    res.status(200).send({teachers: teacherLinks});
}

export async function postWaitingroomTeacher(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const teacherLink = zTeacherLink.safeParse(req.body.teacher);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!teacherLink.success) return throwExpressException(400, "invalid teacherLink", next);

    const JWToken = getJWToken(req, next);
    const auth1 = await doesTokenBelongToTeacher(classId.data, JWToken);
    if (!auth1.success) return throwExpressException(auth1.errorCode, auth1.errorMessage, next);

    await prisma.waitingroomTeacher.create({
        data: {
            classes_id: classId.data,
            teachers_id: splitId(teacherLink.data)
        }
    })
    res.status(200).send();
}

export async function patchWaitingroomTeacher(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const teacherId = z.coerce.number().safeParse(req.params.teacherId);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!teacherId.success) return throwExpressException(400, "invalid teacherLink", next);

    const JWToken = getJWToken(req, next);
    const auth1 = await doesTokenBelongToTeacher(classId.data, JWToken);
    if (!auth1.success) return throwExpressException(auth1.errorCode, auth1.errorMessage, next);

    await prisma.$transaction([
        prisma.waitingroomTeacher.deleteMany({
            where: {
                classes_id: classId.data,
                teachers_id: teacherId.data
            }
        }),
        prisma.classTeacher.create({
            data: {
                classes_id: classId.data,
                teachers_id: teacherId.data
            }
        })

    ])
    res.status(200).send();
}

export async function deleteWaitingroomTeacher(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const teacherId = z.coerce.number().safeParse(req.params.teacherId);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!teacherId.success) return throwExpressException(400, "invalid teacherLink", next);

    const JWToken = getJWToken(req, next);
    const auth1 = await doesTokenBelongToTeacher(classId.data, JWToken);
    if (!auth1.success) return throwExpressException(auth1.errorCode, auth1.errorMessage, next);

    await
        prisma.waitingroomTeacher.deleteMany({
            where: {
                classes_id: classId.data,
                teachers_id: teacherId.data
            }
        })
    res.status(200).send();
}