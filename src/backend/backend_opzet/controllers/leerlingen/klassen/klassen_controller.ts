import {Request, Response,} from "express";
import {prisma, website_base} from "../../../index.ts";
import {z} from "zod";

export async function leerling_klassen(req: Request, res: Response) {
    try {
        let studentId = z.number().safeParse(req.params.leerling_id);
        if (!studentId.success) {
            res.status(400).send({error: "invalid studentId"});
            return;
        }
        const leerling = await prisma.student.findUnique({
            where: {
                id: studentId.data
            }
        });
        if (!leerling) {
            res.status(404).send({error: "non existent student"});
            return;
        }
        const classes = await prisma.classStudent.findMany({
            where: {
                students_id: studentId.data
            }
        });
        let classesLinks = classes.map(klas => website_base + "/klassen/" + klas.classes_id);
        res.status(200).send(classesLinks);
    } catch (e) {
        res.status(500).send({error: "internal server error"})
    }
}