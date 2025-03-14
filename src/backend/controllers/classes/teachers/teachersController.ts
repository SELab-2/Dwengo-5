import {NextFunction, Request, Response} from "express";
import {z} from "zod";
import {throwExpressException} from "../../../exceptions/ExpressException.ts";
import {prisma} from "../../../index.ts";
import {
    doesTokenBelongToStudentInClass,
    doesTokenBelongToTeacher,
    doesTokenBelongToTeacherInClass,
    getJWToken,
} from "../../authentication/extraAuthentication.ts";

export async function getClassTeachers(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    if (!classId.success)
        return throwExpressException(400, "invalid classId", next);

    const classroom = await prisma.class.findUnique({
        where: {id: classId.data},
        include: {classes_teachers: true},
    });
    if (!classroom) return throwExpressException(404, "class not found", next);

    const token = getJWToken(req, next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, token);
    const auth2 = await doesTokenBelongToStudentInClass(classId.data, token);
    if (!(auth1.success || auth2.success))
        return throwExpressException(
            403,
            auth1.errorMessage + " and " + auth2.errorMessage,
            next
        );

    const teacherLinks = classroom.classes_teachers.map(
        (teacher) => `/leerkrachten/${teacher.teachers_id}`
    );
    res.status(200).send({leerkrachten: teacherLinks});
}

export async function postClassTeacher(req: Request, res: Response, next: NextFunction) {
    //todo: bespreken of dit met wachtij moet of hoe anders enzo kwni
    const classId = z.coerce.number().safeParse(req.params.classId);
    const teacherId = z.string().regex(/^\/leerkrachten\/\d+$/).safeParse(req.body.leerkracht);
    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!teacherId.success) return throwExpressException(400, "invalid teacherId", next);

    const classroom = await prisma.class.findUnique({
        where: {id: classId.data},
    });
    if (!classroom) return throwExpressException(404, "class not found", next);

    await prisma.classTeacher.create({
        data: {
            teachers_id: Number(teacherId.data.split("/").at(-1)),
            classes_id: classId.data
        }
    });
    res.status(200).send();
}

export async function deleteClassTeacher(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const teacherId = z.coerce.number().safeParse(req.params.teacherstudentId);
    if (!classId.success)
        return throwExpressException(400, "invalid classId", next);
    if (!teacherId.success)
        return throwExpressException(400, "invalid teacherId", next);

    const classroom = await prisma.class.findUnique({
        where: {id: classId.data},
    });
    if (!classroom) return throwExpressException(404, "class not found", next);

    const token = getJWToken(req, next);
    const auth1 = await doesTokenBelongToTeacher(teacherId.data, token);
    if (!auth1.success) return throwExpressException(403, auth1.errorMessage, next);

    // todo: hoe doen we het dat als een klas zijn laatste leerkracht
    // todo: verliest, deze ook verwijderd wordt. is dit db of api taak
    await prisma.classTeacher.delete({
        where: {
            classes_id_teachers_id: {
                teachers_id: teacherId.data,
                classes_id: classId.data,
            },
        },
    });
    res.status(200).send();
}
