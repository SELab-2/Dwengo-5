import {NextFunction, Request, Response} from "express";
import {prisma} from "../../../index.ts";
import {z} from "zod";
import {throwExpressException} from "../../../exceptions/ExpressException.ts";

export async function getStudentClasses(req: Request, res: Response, next: NextFunction) {
    const studentId = z.coerce.number().safeParse(req.params.studentId);
    if (!studentId.success) return throwExpressException(400, "invalid studentId", next);

    const student = await prisma.student.findUnique({
        where: {id: studentId.data},
    });
    if (!student) return throwExpressException(404, "student not found", next);

    const classes = await prisma.classStudent.findMany({
        where: {students_id: studentId.data},
    });
    const classesLinks = classes.map(classroom => `/klassen/${classroom.classes_id}`);
    res.status(200).send({classes: classesLinks});
}
