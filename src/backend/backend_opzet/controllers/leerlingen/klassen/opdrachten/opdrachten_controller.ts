import {Request, Response} from "express";
import {z} from "zod";
import {prisma, website_base} from "../../../../index.ts";

export async function leerling_opdrachten(req: Request, res: Response) {
    try {
        let studentId = z.number().safeParse(req.params.leerling_id);
        if (studentId.error) {
            res.status(400).send({error: "invalid studentId"});
            return;
        }
        const student = await prisma.student.findUnique({
            where: {
                id: studentId.data
            }
        });
        if (!student) {
            res.status(404).send({error: "student not found"});
            return;
        }
        let classId = z.number().safeParse(req.params.klas_id);
        if (classId.error) {
            res.status(404).send({error: "class not found"});
            return;
        }
        let assignments = await prisma.assignment.findMany({
            where: {
                groups: {
                    some: {
                        students_groups: {
                            some: {
                                students_id: studentId.data
                            }
                        }
                    }
                }
            }
        });
        let assignmentLinks = assignments.map(assignment => website_base + "/opdrachten/" + assignment.id);
        res.status(200).send(assignmentLinks);
    } catch (e) {
        res.status(500).send({error: "internal server error"})
    }

}