import {NextFunction, Request, Response} from "express";
import {prisma} from "../../../../index.ts";
import {z} from "zod";
import {throwExpressException} from "../../../../exceptions/ExpressException.ts";
import {splitId, studentLink} from "../../../../help/links.ts";
import {zStudentLink} from "../../../../help/validation.ts";

export async function getAssignmentStudents(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const assignmentId = z.coerce.number().safeParse(req.params.assignmentId);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!assignmentId.success) return throwExpressException(400, "invalid assignmentId", next);

    const assignment = await prisma.assignment.findUnique({
        where: {id: assignmentId.data},
        include: {
            groups: {
                include: {
                    students_groups: true
                }
            }
        }
    });
    if (!assignment) return throwExpressException(404, "assignment not found", next);

    const leerpaden_links = assignment.groups.flatMap(group =>
        group.students_groups.map(student => studentLink(student.students_id))
    );
    res.status(200).send({students: leerpaden_links});
}

export async function postAssignmentStudent(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const assignmentId = z.coerce.number().safeParse(req.params.assignmentId);
    const studentLink = zStudentLink.safeParse(req.body.leerling);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!assignmentId.success) return throwExpressException(400, "invalid assignmentId", next);
    if (!studentLink.success) return throwExpressException(400, "invalid studentLink", next);

    const student = await prisma.student.findUnique({
        where: {id: splitId(studentLink.data)}
    });
    if (!student) return throwExpressException(404, "student not found", next);

    await prisma.group.create({
        data: {
            assignment: assignmentId.data,
            class: classId.data,
            students_groups: {
                create: [{students_id: student.id}]
            }
        }
    });
    res.status(200).send();
}

export async function deleteAssignmentStudent(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const assignmentId = z.coerce.number().safeParse(req.params.assignmentId);
    const studentId = z.coerce.number().safeParse(req.params.studentId);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!assignmentId.success) return throwExpressException(400, "invalid assignmentId", next);
    if (!studentId.success) return throwExpressException(400, "invalid studentId", next);

    await prisma.studentGroup.deleteMany({
        where: {
            students_id: studentId.data,
            groups: {
                assignments: {
                    id: assignmentId.data
                }
            }
        }
    });
    res.status(200).send();
}