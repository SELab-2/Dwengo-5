import {NextFunction, Request, Response} from "express";
import {z} from "zod";
import {throwExpressException} from "../../../exceptions/ExpressException.ts";
import {prisma} from "../../../index.ts";
import {
    doesTokenBelongToStudentInClass,
    doesTokenBelongToTeacherInClass,
    getJWToken,
} from "../../authentication/extraAuthentication.ts";
import {splitId, studentLink, teacherLink} from "../../../help/links.ts";
import {zTeacherLink} from "../../../help/validation.ts";

export async function getClassTeachers(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    if (!classId.success) return throwExpressException(400, "invalid classId", next);

    const token = getJWToken(req, next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, token);
    const auth2 = await doesTokenBelongToStudentInClass(classId.data, token);
    if (!(auth1.success || auth2.success))
        return throwExpressException(403, auth1.errorMessage + " and " + auth2.errorMessage, next);

    const teachers = await prisma.classTeacher.findMany({
        where: {classes_id: classId.data, accepted: true},
    });
    const waitingroom = await prisma.classTeacher.findMany({
        where: {classes_id: classId.data, accepted: false},
    });

    const teacherLinks = teachers.map(teacher => teacherLink(teacher.teachers_id));
    const waitingroomlinks = waitingroom.map(teacher => teacherLink(teacher.teachers_id));
    res.status(200).send({
        teachers: teacherLinks,
        waitingroom: waitingroomlinks,
    });
}

export async function postClassTeacher(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const teacherLink = zTeacherLink.safeParse(req.body.teacher);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!teacherLink.success) return throwExpressException(400, "invalid teacherLink", next);

    const token = getJWToken(req, next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, token);
    if (!auth1.success) return throwExpressException(403, auth1.errorMessage, next);

    await prisma.classTeacher.create({
        data: {
            teachers_id: Number(teacherLink.data.split("/").at(-1)),
            classes_id: classId.data,
            accepted: false,
        }
    });
    res.status(200).send();
}

export async function patchClassTeacher(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const teacherId = z.coerce.number().safeParse(req.params.teacherId);
    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!teacherId.success) return throwExpressException(400, "invalid teacher", next);

    const token = getJWToken(req, next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, token);
    if (!auth1.success) return throwExpressException(403, auth1.errorMessage, next);

    await prisma.classTeacher.update({
        where: {
            classes_id_teachers_id: {
                classes_id: classId.data,
                teachers_id: teacherId.data,
            }
        },
        data: {
            accepted: true
        }
    })

    res.status(200).send();
}

export async function deleteClassTeacher(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const teacherId = z.coerce.number().safeParse(req.params.teacherId);
    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!teacherId.success) return throwExpressException(400, "invalid teacherId", next);

    const token = getJWToken(req, next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, token);
    if (!auth1.success) return throwExpressException(403, auth1.errorMessage, next);

    //no class or teacher exist checks needed because auth already does this


    const teacher = await prisma.classTeacher.findUnique({
        where: {
            classes_id_teachers_id: {
                classes_id: classId.data,
                teachers_id: teacherId.data,
            }
        }
    });
    if (!teacher) return throwExpressException(404, "teacher not found", next);

    await prisma.classTeacher.deleteMany({
        where: {
            classes_id: classId.data,
            teachers_id: teacherId.data
        }
    });

    res.status(200).send();
}
