import {NextFunction, Request, Response} from "express";
import {prisma, website_base} from "../../../../index.ts";
import {z} from "zod";
import {throwExpressException} from "../../../../exceptions/ExpressException.ts";

//const prisma = new PrismaClient();

// Get /klassen/:klas_id/opdrachten/:opdracht_id/leerlingen
export async function opdracht_leerlingen(req: Request, res: Response) {

    try {
        let klas_id_string: string = req.params.klas_id;
        let klas_id: number = Number(klas_id_string);

        let opdracht_id_string: string = req.params.opdracht_id;
        let opdracht_id: number = Number(opdracht_id_string);

        const students = await prisma.assignment.findUnique({
            where: {
                id: opdracht_id
            },
            include: {
                groups: {
                    include: {
                        students_groups: true
                    }
                }
            }
        });
        if (!students) {
            res.status(404).send("niks")
            return;
        }

        students.groups[0].students_groups[0].students_id;

        let leerpaden_links = students.groups.flatMap(group =>
            group.students_groups.map((student: { students_id: number }) =>
                `${website_base}/leerlingen/${student.students_id}`
            )
        );

        res.status(200).send(leerpaden_links)
    } catch (error) {
        res.status(500).send({error: "internal server error ${e}"});
    }

}

// Post /klassen/:klas_id/opdrachten/:opdracht_id/leerlingen
export async function opdracht_voeg_leerling_toe(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.klas_id);
    const assignmentId = z.coerce.number().safeParse(req.params.opdracht_id);
    const studentLink = z.string().regex(/^\/leerlingen\/\d+$/).safeParse(req.body.leerling);
    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!assignmentId.success) return throwExpressException(400, "invalid classId", next);
    if (!studentLink.success) return throwExpressException(400, "invalid classId", next);

    const student = await prisma.student.findUnique({
        where: {id: Number(studentLink.data.split("/").at(-1)!)}
    });
    if (!student) return throwExpressException(404, "student not found", next);

    const newGroup = await prisma.group.create({
        data: {
            assignment: assignmentId.data,
            class: classId.data,
        }
    });
    await prisma.studentGroup.create({
        data: {
            students_id: student.id,
            groups_id: newGroup.id,
        }
    });
    res.status(200).send("added student with succes");
}

export async function opdracht_verwijder_leerling(req: Request, res: Response) {
    try {
        let klas_id_string: string = req.params.klas_id;
        let klas_id: number = Number(klas_id_string);

        let opdracht_id_string: string = req.params.opdracht_id;
        let opdracht_id: number = Number(opdracht_id_string);

        let student_id_string: string = req.params.leerling_id;
        let student_id: number = Number(student_id_string);

        const assignment = await prisma.assignment.findUnique({
            where: {
                id: opdracht_id
            },
        });
        if (!assignment) {
            res.status(404).send("no assignment with this Id")
            return
        }


        let studentGroup1 = await prisma.studentGroup.findFirst({
            where: {
                groups: {
                    assignment: assignment.id
                },
                students: {
                    id: student_id
                }
            }
        });

        if (!studentGroup1) {
            res.status(404).send("error")
            return;
        }


        await prisma.studentGroup.delete({
            where: {
                students_id_groups_id: {
                    students_id: studentGroup1.students_id,
                    groups_id: studentGroup1.groups_id,
                },

                groups: {
                    assignments: {
                        id: opdracht_id
                    }
                }
            }
        });
        res.status(200).send("deleted with succes")
    } catch (error) {
        res.status(500).send({error: "internal server error ${e}"});
    }

}