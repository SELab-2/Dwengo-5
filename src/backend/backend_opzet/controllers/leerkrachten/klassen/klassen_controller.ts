import {NextFunction, Request, Response} from "express";
import {prisma} from "../../../index.ts";
import {z} from "zod";
import {ExpressException} from "../../../exceptions/ExpressException.ts";

// GET /leerkrachten/:teacher_id/klassen
export async function leerkrachtKlassen(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const teacherId = z.coerce.number().safeParse(req.params.leerkracht_id);
    if (!teacherId.success)
        throw new ExpressException(400, "invalid teacherId", next);

    const leerkracht = await prisma.teacher.findUnique({
        where: {id: teacherId.data},
    });
    if (!leerkracht) throw new ExpressException(404, "teacher not found", next);

    const klassen = await prisma.classTeacher.findMany({
        where: {teachers_id: teacherId.data},
    });
    const klassen_links = klassen.map(
        (klas) => `/klassen/${klas.classes_id}`
    );
    res.status(200).send({klassen: klassen_links});
}
