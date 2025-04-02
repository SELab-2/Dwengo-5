import {NextFunction, Request, Response} from "express";
import {prisma} from "../../index.ts";
import {z} from "zod"
import {throwExpressException} from "../../exceptions/ExpressException.ts";
import {
    doesTokenBelongToStudentInClass,
    doesTokenBelongToTeacher,
    doesTokenBelongToTeacherInClass,
    getJWToken,
} from "../authentication/extraAuthentication.ts";
import {zTeacherLink} from "../../help/validation.ts";
import {classLink, splitId} from "../../help/links.ts";

export async function getClass(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    if (!classId.success) return throwExpressException(400, "invalid class id", next);

    const JWToken = getJWToken(req, next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    const auth2 = await doesTokenBelongToStudentInClass(classId.data, JWToken);
    if (!(auth1.success || auth2.success))
        return throwExpressException(403, auth1.errorMessage + " and " + auth2.errorMessage, next);

    const classroom = await prisma.class.findUnique({
        where: {id: classId.data},
    });
    if (!classroom) return throwExpressException(404, "class not found", next);

    res.status(200).send({
        name: classroom.name,
        links: {
            students: req.originalUrl + "/students",
            teachers: req.originalUrl + "/teachers",
            info: req.originalUrl + "/info",
            assignments: req.originalUrl + "/assignments",
            conversations: req.originalUrl + "/conversations",
        }
    });
}

export async function postClass(req: Request, res: Response, next: NextFunction) {
    const name = z.string().safeParse(req.body.name);
    const teacherLink = zTeacherLink.safeParse(req.body.teacher);

    if (!name.success) return throwExpressException(400, "invalid name", next);
    if (!teacherLink.success) return throwExpressException(400, "invalid teacher", next);

    const JWToken = getJWToken(req, next);
    const auth1 = await doesTokenBelongToTeacher(splitId(teacherLink.data), JWToken);
    if (!auth1.success) return throwExpressException(403, auth1.errorMessage, next);

    //teacher exist check done by auth

    const classroom = await prisma.class.create({
        data: {
            name: name.data,
            classes_teachers: {
                create: {
                    teachers_id: splitId(teacherLink.data),
                }
            }
        }
    });
    res.status(200).send({classroom: classLink(classroom.id)});
}

export async function deleteClass(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    if (!classId.success) return throwExpressException(400, "invalid class id", next);

    const JWToken = getJWToken(req, next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    if (!auth1.success) return throwExpressException(403, auth1.errorMessage, next);

    //class exist check done by auth

    await prisma.$transaction([
        prisma.classTeacher.deleteMany({
            where: {classes_id: classId.data}
        }),
        prisma.class.deleteMany({
            where: {id: classId.data},
        }),
    ]);
    res.status(200).send();
}
