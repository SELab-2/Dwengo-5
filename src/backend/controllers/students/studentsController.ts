import {NextFunction, Request, Response} from "express";
import {z} from "zod";
import {prisma} from "../../index.ts";
import {throwExpressException} from "../../exceptions/ExpressException.ts";

export async function getStudent(req: Request, res: Response, next: NextFunction) {
    const studentId = z.coerce.number().safeParse(req.params.studentId);
    if (!studentId.success) return throwExpressException(400, "invalid studentId", next);

    const student = await prisma.student.findUnique({
        where: {id: studentId.data},
    });
    if (!student) return throwExpressException(404, "student not found", next);
    res.status(200).send({
        name: student.username,
        links: {
            classes: req.originalUrl + "/classes"
        }
    });
}

export async function deleteStudent(req: Request, res: Response, next: NextFunction) {
    const studentId = z.coerce.number().safeParse(req.params.studentId);
    if (!studentId.success) return throwExpressException(400, "invalid studentId", next);

    const student = prisma.student.findUnique({
        where: {id: studentId.data}
    });
    if (!student) return throwExpressException(404, "student not found", next);

    await prisma.$transaction([
        prisma.student.deleteMany({
            where: {id: studentId.data},
        })
    ]);
    res.status(200).send();
}
