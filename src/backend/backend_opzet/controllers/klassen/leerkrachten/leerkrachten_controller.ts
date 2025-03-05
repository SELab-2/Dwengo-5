import {Request, Response} from "express";
import {z} from "zod";
import {ExpressException} from "../../../exceptions/ExpressException.ts";
import {prisma, website_base} from "../../../index.ts";
import {
    doesTokenBelongToStudentInClass,
    doesTokenBelongToTeacher,
    doesTokenBelongToTeacherInClass,
    getJWToken
} from "../../authenticatie/extra_auth_functies.ts";

export async function klas_leerkrachten(req: Request, res: Response) {
    const classId = z.number().safeParse(req.params.klas_id);
    if (!classId.success) throw new ExpressException(400, "invalid classId");

    const classroom = await prisma.class.findUnique({
        where: {id: classId.data}, include: {classes_teachers: true}
    });
    if (!classroom) throw new ExpressException(404, "class not found");

    const token = getJWToken(req);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, token);
    const auth2 = await doesTokenBelongToStudentInClass(classId.data, token);
    if (!(auth1.success || auth2.success))
        throw new ExpressException(403, auth1.errorMessage + " and " + auth2.errorMessage);

    const teacherLinks = classroom.classes_teachers.map(teacher =>
        website_base + `/leerkrachten/${teacher.teachers_id}`);
    res.status(200).send(teacherLinks);
}

export async function voeg_leerkracht_toe(req: Request, res: Response) {
    //todo: bespreken of dit met wachtij moet of hoe anders enzo kwni
}

export async function klas_verwijder_leerkracht(req: Request, res: Response) {
    const classId = z.number().safeParse(req.params.klas_id);
    const teacherId = z.number().safeParse(req.params.leerkracht_id);
    if (!classId.success) throw new ExpressException(400, "invalid classId");
    if (!teacherId.success) throw new ExpressException(400, "invalid teacherId");

    const classroom = await prisma.class.findUnique({
        where: {id: classId.data}
    });
    if (!classroom) throw new ExpressException(404, "class not found");

    const token = getJWToken(req);
    const auth1 = await doesTokenBelongToTeacher(teacherId.data, token);
    if (!auth1.success) throw new ExpressException(403, auth1.errorMessage);

    // todo: hoe doen we het dat als een klas zijn laatste leerkracht
    // todo: verliest, deze ook verwijderd wordt. is dit db of api taak
    await prisma.classTeacher.delete({
        where: {
            classes_id_teachers_id: {
                teachers_id: teacherId.data,
                classes_id: classId.data
            }
        }
    });
    res.status(200).send();
}