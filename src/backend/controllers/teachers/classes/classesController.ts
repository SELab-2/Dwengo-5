import {NextFunction, Request, Response} from "express";
import {prisma} from "../../../index.ts";
import {z} from "zod";
import {throwExpressException} from "../../../exceptions/ExpressException.ts";
import {classLink} from "../../../help/links.ts";

export async function getClassTeachers(req: Request, res: Response, next: NextFunction) {
    const teacherId = z.coerce.number().safeParse(req.params.teacherstudentId);
    if (!teacherId.success) return throwExpressException(400, "invalid teacherId", next);

    const teacher = await prisma.teacher.findUnique({
        where: {id: teacherId.data},
    });
    if (!teacher) return throwExpressException(404, "teacher not found", next);

    const classes = await prisma.classTeacher.findMany({
        where: {teachers_id: teacherId.data},
    });
    const classesLinks = classes.map(classroom => classLink(classroom.classes_id));
    res.status(200).send({classes: classesLinks});
}
