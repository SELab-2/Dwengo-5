import {Request, Response,} from "express";
import {prisma, website_base} from "../../../index.ts";
import {z} from "zod";

export async function leerling_klassen(req: Request, res: Response) {
    try {
        let leerling_id = z.number().safeParse(req.params.leerling_id);
        if (leerling_id.error) {
            res.status(400).send({error: "invalid studentId"});
            return;
        }
        const leerling = await prisma.student.findUnique({
            where: {
                id: leerling_id.data
            }
        });
        if (!leerling) {
            res.status(404).send({error: "non existent student"});
            return;
        }
        const klassen = await prisma.classStudent.findMany({
            where: {
                students_id: leerling_id.data
            }
        });
        let klassen_links = klassen.map(klas => website_base + "/klassen/" + klas.classes_id);
        res.status(200).send(klassen_links);
    } catch (e) {
        res.status(500).send({error: "internal server error"})
    }
}