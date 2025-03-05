import {Request, Response,} from "express";
import {prisma, website_base} from "../../../index.ts";
import {z} from "zod";
import {ExpressException} from "../../../exceptions/ExpressException.ts";

export async function leerling_klassen(req: Request, res: Response) {
    const studentId = z.number().safeParse(req.params.leerling_id);
    if (!studentId.success) throw new ExpressException(400, "invalid studentId");

    const leerling = await prisma.student.findUnique({
        where: {id: studentId.data}
    });
    if (!leerling) throw new ExpressException(404, "non existent student");

    const classes = await prisma.classStudent.findMany({
        where: {students_id: studentId.data}
    });
    const classesLinks = classes.map(klas => website_base + "/klassen/" + klas.classes_id);
    res.status(200).send(classesLinks);
}