import {NextFunction, Request, Response} from "express";
import {z} from "zod";
import {prisma} from "../../index.ts";
import {ExpressException} from "../../exceptions/ExpressException.ts";

export async function leerling(req: Request, res: Response, next: NextFunction) {
    const studentId = z.coerce.number().safeParse(req.params.leerling_id);
    if (!studentId.success) throw new ExpressException(400, "invalid studentId", next);

    const student = await prisma.student.findUnique({
        where: {id: studentId.data}
    });
    if (!student) throw new ExpressException(404, "non existent student", next);

    res.status(200).send({name: student.username});
}

export async function verwijder_leerling(req: Request, res: Response, next: NextFunction) {
    const studentId = z.coerce.number().safeParse(req.params.leerling_id);
    if (!studentId.success) throw new ExpressException(400, "invalid studentId", next);

    const student = await prisma.student.findUnique({
        where: {id: studentId.data}
    });
    if (!student) throw new ExpressException(404, "student doesn't exist", next);

    await prisma.student.delete({
        where: {id: studentId.data}
    });
    res.status(200).send();
}
