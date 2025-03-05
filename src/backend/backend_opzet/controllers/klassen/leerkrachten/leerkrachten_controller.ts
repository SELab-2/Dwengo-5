import {Request, Response} from "express";
import {z} from "zod";
import {ExpressException} from "../../../exceptions/ExpressException.ts";
import {prisma, website_base} from "../../../index.ts";

export async function klas_leerkrachten(req: Request, res: Response) {
    const classId = z.number().safeParse(req.params.klas_id);
    if (!classId.success) throw new ExpressException(400, "invalid classId");

    const classroom = await prisma.class.findUnique({
        where: {id: classId.data}, include: {classes_teachers: true}
    });
    if (!classroom) throw new ExpressException(404, "class not found");

    const teacherLinks = classroom.classes_teachers.map(teacher =>
        website_base + `/leerkrachten/${teacher.teachers_id}`);
    res.status(200).send(teacherLinks);
}

export async function voeg_leerkracht_toe(req: Request, res: Response) {

}

export async function klas_verwijder_leerkracht(req: Request, res: Response) {

}