import {NextFunction, Request, Response} from "express";
import {z} from "zod";
import {prisma} from "../../index.ts";
import {throwExpressException} from "../../exceptions/ExpressException.ts";
import {doesTokenBelongToStudent, getJWToken} from "../authentication/extraAuthentication.ts";

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

    //student exist check done by auth middleware

    await prisma.$transaction([
        prisma.studentGroup.deleteMany({
            where: {
                students_id: studentId.data
            }
        }),
        prisma.classStudent.deleteMany({
            where: {students_id: studentId.data}
        }),
        prisma.studentLearningObject.deleteMany({
            where: {
                students_id: studentId.data
            }
        }),
        prisma.student.deleteMany({
            where: {id: studentId.data},
        })
    ]);
    res.status(200).send();
}
