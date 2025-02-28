import {Request, Response} from "express";
import {PrismaClient} from "@prisma/client";
import {website_base} from "../../../index.ts";

const prisma = new PrismaClient();

export async function leerkracht_klassen(req: Request, res: Response) {
    try {
        //todo: auth
        let leerkracht_id_string: string = req.params.leerkracht_id;
        let leerkracht_id: number = Number(leerkracht_id_string);
        if (isNaN(leerkracht_id)) {
            res.status(400).send({error: "not a conforming teacher_id"});
            return;
        }
        const leerkracht = await prisma.teacher.findUnique({
            where: {
                id: leerkracht_id
            }
        });
        if(!leerkracht){
            res.status(404).send({error:"teacher not found"})
            return;
        }
        const klassen = await prisma.classTeacher.findMany({
            where: {
                teachers_id: leerkracht_id
            }
        });
        let klassen_links = klassen.map(klas=>website_base + "/" + klas.classes_id);
        res.status(200).send(klassen_links);
    } catch (e) {
        res.status(500).send({error: "internal server error"})
    }
}