import {NextFunction, Request, Response} from "express";
import {prisma} from "../../../../../index.ts";
import {z} from "zod";
import {throwExpressException} from "../../../../../exceptions/ExpressException.ts";
import {
    doesTokenBelongToStudentInClass,
    doesTokenBelongToTeacherInClass,
    getJWToken
} from "../../../../authentication/extraAuthentication.ts";
import {splitId, studentLink} from "../../../../../help/links.ts";
import {studentRexp} from "../../../../../help/validation.ts";


export async function getGroupStudents(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const assignmentId = z.coerce.number().safeParse(req.params.assignmentId);
    const groupId = z.coerce.number().safeParse(req.params.groupId);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!assignmentId.success) return throwExpressException(400, "invalid assignmentId", next);
    if (!groupId.success) return throwExpressException(400, "invalid groupId", next);

    const JWToken = getJWToken(req, next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    const auth2 = await doesTokenBelongToStudentInClass(classId.data, JWToken);
    if (!(auth1.success || auth2.success))
        return throwExpressException(403, auth1.errorMessage + " and " + auth2.errorMessage, next);

    const classroom = await prisma.class.findFirst({
        where: {id: classId.data}
    });
    if (!classroom) return throwExpressException(404, "group not found", next);

    const assignment = await prisma.assignment.findFirst({
        where: {
            id: assignmentId.data,
            class: classId.data
        }
    });
    if (!assignment) return throwExpressException(404, "group not found", next);

    const group = await prisma.group.findFirst({
        where: {
            id: groupId.data,
            class: classId.data,
            assignment: assignmentId.data
        }
    });
    if (!group) return throwExpressException(404, "group not found", next);

    const students = await prisma.studentGroup.findMany({
        where: {
            groups_id: groupId.data,
            groups: {
                assignment: assignmentId.data,
                class: classId.data
            }
        }
    });
    const studentLinks = students.map(student => studentLink(student.students_id));
    res.status(200).send({leerlingen: studentLinks});
}

export async function postGroupStudent(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const assignmentId = z.coerce.number().safeParse(req.params.assignmentId);
    const groupId = z.coerce.number().safeParse(req.params.groupId);
    const studentLink = z.string().regex(studentRexp).safeParse(req.body.student);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!assignmentId.success) return throwExpressException(400, "invalid assignmentId", next);
    if (!groupId.success) return throwExpressException(400, "invalid groupId", next);
    if (!studentLink.success) return throwExpressException(400, "invalid studentLink", next);

    const JWToken = getJWToken(req, next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    const auth2 = await doesTokenBelongToStudentInClass(classId.data, JWToken);
    if (!(auth1.success || auth2.success))
        return throwExpressException(403, auth1.errorMessage + " and " + auth2.errorMessage, next);

    const classroom = await prisma.class.findFirst({
        where: {id: classId.data}
    });
    if (!classroom) return throwExpressException(404, "group not found", next);

    const assignment = await prisma.assignment.findFirst({
        where: {
            id: assignmentId.data,
            class: classId.data
        }
    });
    if (!assignment) return throwExpressException(404, "group not found", next);

    const group = await prisma.group.findFirst({
        where: {
            id: groupId.data,
            assignment: assignmentId.data,
            class: classId.data
        }
    });
    if (!group) return throwExpressException(404, "group not found", next);

    const student = await prisma.student.findUnique({
        where: {id: splitId(studentLink.data)}
    });
    if (!student) return throwExpressException(404, "student not found", next);

    await prisma.studentGroup.create({
        data: {
            students_id: splitId(studentLink.data),
            groups_id: groupId.data
        }
    });
    res.status(200).send();
}

export async function deleteGroupStudent(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const assignmentId = z.coerce.number().safeParse(req.params.assignmentId);
    const groupId = z.coerce.number().safeParse(req.params.groupId);
    const studentId = z.coerce.number().safeParse(req.params.studentId);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!assignmentId.success) return throwExpressException(400, "invalid assignmentId", next);
    if (!groupId.success) return throwExpressException(400, "invalid groupId", next);
    if (!studentId.success) return throwExpressException(400, "invalid studentId", next);

    const JWToken = getJWToken(req, next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    const auth2 = await doesTokenBelongToStudentInClass(classId.data, JWToken);
    if (!(auth1.success || auth2.success))
        return throwExpressException(403, auth1.errorMessage + " and " + auth2.errorMessage, next);

    const classroom = await prisma.class.findUnique({
        where: {id: classId.data}
    });
    if (!classroom) return throwExpressException(404, "group not found", next);

    const assignment = await prisma.assignment.findUnique({
        where: {
            id: assignmentId.data,
            class: classId.data
        }
    });
    if (!assignment) return throwExpressException(404, "group not found", next);

    const group = await prisma.group.findUnique({
        where: {
            id: groupId.data,
            assignment: assignmentId.data,
            class: classId.data
        }
    });
    if (!group) return throwExpressException(404, "group not found", next);

    const student = await prisma.student.findUnique({
        where: {id: studentId.data}
    });
    if (!student) return throwExpressException(404, "student not found", next);

    const studentGroup = await prisma.studentGroup.findFirst({
        where: {
            students_id: studentId.data,
            groups_id: groupId.data,
        },
    });
    if (!studentGroup) return throwExpressException(404, "student not in group", next);

    await prisma.studentGroup.deleteMany({
        where: {
            students_id: studentId.data,
            groups_id: groupId.data
        }
    });
    res.status(200).send();
}
