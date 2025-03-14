import {NextFunction, Request, Response} from "express";
import {prisma} from "../../../../index.ts";
import {z} from "zod";
import {throwExpressException} from "../../../../exceptions/ExpressException.ts";

// Get /classes/:classId/assignments/:assignmentId/students
export async function opdracht_leerlingen(req: Request, res: Response, next: NextFunction) {
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
        group.students_groups.map((student) => `/leerlingen/${student.students_id}`)
    );
    res.status(200).send({leerlingen: leerpaden_links});
}

// Post /classes/:classId/assignments/:assignmentId/students
export async function opdracht_voeg_leerling_toe(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const assignmentId = z.coerce.number().safeParse(req.params.assignmentId);
    const studentLink = z.string().regex(/^\/leerlingen\/\d+$/).safeParse(req.body.leerling);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!assignmentId.success) return throwExpressException(400, "invalid assignmentId", next);
    if (!studentLink.success) return throwExpressException(400, "invalid studentLink", next);

    const student = await prisma.student.findUnique({
        where: {id: Number(studentLink.data.split("/").at(-1)!)}
    });
    if (!student) return throwExpressException(404, "student not found", next);

    const newGroup = await prisma.group.create({
        data: {assignment: assignmentId.data, class: classId.data,}
    });
    await prisma.studentGroup.create({
        data: {students_id: student.id, groups_id: newGroup.id,}
    });
    res.status(200).send();
}

export async function opdracht_verwijder_leerling(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const assignmentId = z.coerce.number().safeParse(req.params.assignmentId);
    const studentId = z.coerce.number().safeParse(req.params.studentId);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!assignmentId.success) return throwExpressException(400, "invalid assignmentId", next);
    if (!studentId.success) return throwExpressException(400, "invalid studentId", next);

    await prisma.studentGroup.deleteMany({
        where: {
            students_id: studentId.data,
            groups: {assignments: {id: assignmentId.data}}
        }
    });
    res.status(200).send();
}