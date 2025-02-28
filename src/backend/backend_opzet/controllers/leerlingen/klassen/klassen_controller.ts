import {Request, Response,} from "express";
import {PrismaClient} from "@prisma/client";
import {website_base} from "../../../index.ts";

const prisma = new PrismaClient();

export async function leerling_klassen(req: Request, res: Response) {
    try {
        //todo: auth
        let leerling_id_string: string = req.params.leerling_id;
        let leerling_id: number = Number(leerling_id_string);
        if (isNaN(leerling_id)) {
            res.status(400).send({error: "not a conforming student_id"});
            return;
        }
        const leerling = await prisma.student.findUnique({
            where: {
                id: leerling_id
            }
        });
        if(!leerling){
            res.status(404).send({error:"student not found"})
            return;
        }
        const klassen = await prisma.classStudent.findMany({
            where: {
                students_id: leerling_id
            }
        });
        let klassen_links = klassen.map(klas=>website_base + "/" + klas.classes_id);
        res.status(200).send(klassen_links);
    } catch (e) {
        res.status(500).send({error: "internal server error"})
    }

}