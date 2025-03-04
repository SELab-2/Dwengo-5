import {Request, Response} from "express";
import {prisma, website_base} from "../../../index.ts";
import {z} from "zod";

export async function leerkracht_klassen(req: Request, res: Response) {
    try {
        let teacherId = z.number().safeParse(req.params.leerkracht_id);
        if (!teacherId.success) {
            res.status(400).send({error: "invalie teacherId"});
            return;
        }
        const leerkracht = await prisma.teacher.findUnique({
            where: {
                id: teacherId.data
            }
        });
        if (!leerkracht) {
            res.status(404).send({error: "teacher not found"});
            return;
        }
        const klassen = await prisma.classTeacher.findMany({
            where: {
                teachers_id: teacherId.data
            }
        });
        let klassen_links = klassen.map(klas => website_base + "/klassen/" + klas.classes_id);
        res.status(200).send(klassen_links);
    } catch (e) {
        res.status(500).send({error: "internal error"})
    }
}