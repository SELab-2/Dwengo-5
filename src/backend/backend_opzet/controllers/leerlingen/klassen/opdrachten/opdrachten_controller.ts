import {Request, Response} from "express";
import {website_base} from "../../../../index.ts";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export async function leerling_opdrachten(req: Request, res: Response) {
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
        if (!leerling) {
            res.status(404).send({error: "student not found"})
            return;
        }
        const studentGroups = await prisma.studentGroup.findMany({
            where: {
                students_id: leerling_id
            }
        });
        const groups = await Promise.all(studentGroups.map(async studentGroup =>
            (prisma.group.findUnique({
                where:
                    {
                        id: studentGroup.groups_id
                    }
            }))
        ));
        let assignment_links = groups.map(group => website_base + "/klassen/" + group!.class + "/opdrachten/" + group!.assignment);
        res.status(200).send(assignment_links);
    } catch (e) {
        res.status(500).send({error: "internal server error"})
    }

}