import {NextFunction, Request, Response} from "express";
import {z} from "zod";
import {prisma} from "../../../../index.ts";
import {throwExpressException} from "../../../../exceptions/ExpressException.ts";
import {assignmentLink} from "../../../../help/links.ts";

export async function getStudentAssignments(req: Request, res: Response, next: NextFunction) {
    const studentId = z.coerce.number().safeParse(req.params.studentId);
    const classId = z.coerce.number().safeParse(req.params.classId);

    if (!studentId.success) return throwExpressException(400, "invalid studentId", next);
    if (!classId.success) return throwExpressException(400, "Invalid classId", next);

    const student = await prisma.student.findUnique({
        where: {id: studentId.data},
    });
    if (!student) return throwExpressException(404, "student not found", next);

    const classroom = await prisma.class.findUnique({
        where: {id: classId.data},
    });
    if (!classroom) return throwExpressException(404, "class not found", next);

    const assignments = await prisma.assignment.findMany({
        where: {
            class: classId.data,
            groups: {
                some: {
                    students_groups: {
                        some: {
                            students_id: studentId.data,
                        },
                    },
                },
            },
        },
    });
    const assignmentLinks = assignments.map(assignment =>
        assignmentLink(classId.data, assignment.id));
    res.status(200).send({assignments: assignmentLinks});
}
