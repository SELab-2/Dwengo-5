import {NextFunction, Request, Response} from "express";
import {prisma} from "../../../index.ts";
import {z} from "zod";
import {throwExpressException} from "../../../exceptions/ExpressException.ts";

// GET /teachers/:teacher_id/classes
export async function leerkrachtKlassen(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const teacherId = z.coerce.number().safeParse(req.params.teacherstudentId);
    if (!teacherId.success)
        return throwExpressException(400, "invalid teacherId", next);

    const leerkracht = await prisma.teacher.findUnique({
        where: {id: teacherId.data},
    });
    if (!leerkracht) return throwExpressException(404, "teacher not found", next);

    const klassen = await prisma.classTeacher.findMany({
        where: {teachers_id: teacherId.data},
    });
    const klassen_links = klassen.map(
        (klas) => `/klassen/${klas.classes_id}`
    );
    res.status(200).send({klassen: klassen_links});
}
