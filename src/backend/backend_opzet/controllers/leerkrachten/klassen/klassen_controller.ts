import {Request, Response} from "express";
import {prisma, website_base} from "../../../index.ts";
import {z} from "zod";
import {ExpressException} from "../../../exceptions/ExpressException.ts";

export async function leerkracht_klassen(req: Request, res: Response) {
    const teacherId = z.number().safeParse(req.params.leerkracht_id);
    if (!teacherId.success) throw new ExpressException(400, "invalie teacherId");

    const leerkracht = await prisma.teacher.findUnique({
        where: {id: teacherId.data}
    });
    if (!leerkracht) throw new ExpressException(404, "teacher not found");

    const klassen = await prisma.classTeacher.findMany({
        where: {teachers_id: teacherId.data}
    });
    const klassen_links = klassen.map(klas => website_base + "/klassen/" + klas.classes_id);
    res.status(200).send(klassen_links);
}