import {NextFunction, Request, Response} from "express";
import {prisma} from "../../../../../index.ts";
import {z} from "zod";
import {throwExpressException} from "../../../../../exceptions/ExpressException.ts";
import {
    doesTokenBelongToStudentInAssignment,
    doesTokenBelongToTeacherInClass,
    getJWToken
} from "../../../../authentication/extraAuthentication.ts";
import {groupStudentLink, splitId, userLink} from "../../../../../help/links.ts";
import {zUserLink} from "../../../../../help/validation.ts";


export async function getGroupStudents(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const assignmentId = z.coerce.number().safeParse(req.params.assignmentId);
    const groupId = z.coerce.number().safeParse(req.params.groupId);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!assignmentId.success) return throwExpressException(400, "invalid assignmentId", next);
    if (!groupId.success) return throwExpressException(400, "invalid groupId", next);

    const JWToken = getJWToken(req, next);
    if (!JWToken) return throwExpressException(401, 'no token sent', next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    const auth2 = await doesTokenBelongToStudentInAssignment(classId.data, JWToken);
    if (!(auth1.success || auth2.success))
        return throwExpressException(auth1.errorCode < 300 ? auth2.errorCode : auth1.errorCode, `${auth1.errorMessage} and ${auth2.errorMessage}`, next);

    //class and assignment exist check done by auth

    const group = await prisma.group.findFirst({
        where: {
            id: groupId.data,
            assignment_id: assignmentId.data
        }
    });
    if (!group) return throwExpressException(404, "group not found", next);

    const students = await prisma.studentGroup.findMany({
        where: {
            group_id: groupId.data,
            group: {
                assignment_id: assignmentId.data,
            }
        }
    });
    const studentLinks = students.map(student => userLink(student.student_id));
    res.status(200).send({students: studentLinks});
}

export async function postGroupStudent(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const assignmentId = z.coerce.number().safeParse(req.params.assignmentId);
    const groupId = z.coerce.number().safeParse(req.params.groupId);
    const studentLink = zUserLink.safeParse(req.body.student);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!assignmentId.success) return throwExpressException(400, "invalid assignmentId", next);
    if (!groupId.success) return throwExpressException(400, "invalid groupId", next);
    if (!studentLink.success) return throwExpressException(400, "invalid studentLink", next);

    const JWToken = getJWToken(req, next);
    if(!JWToken) return throwExpressException(401, "invalid token", next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    if (!auth1.success) return throwExpressException(auth1.errorCode, auth1.errorMessage, next);

    //class exist check done by auth

    const assignment = await prisma.assignment.findFirst({
        where: {
            id: assignmentId.data,
            class_id: classId.data
        }
    });
    if (!assignment) return throwExpressException(404, "group not found", next);

    const group = await prisma.group.findFirst({
        where: {
            id: groupId.data,
            assignment_id: assignmentId.data,
        }
    });
    if (!group) return throwExpressException(404, "group not found", next);

    const student = await prisma.student.findUnique({
        where: {id: splitId(studentLink.data)}
    });
    if (!student) return throwExpressException(404, "student not found", next);

    await prisma.studentGroup.create({
        data: {
            student_id: splitId(studentLink.data),
            group_id: groupId.data
        }
    });
    res.status(200).send({groupStudent: groupStudentLink(classId.data, assignmentId.data, groupId.data, splitId(studentLink.data))});
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
    if (!JWToken) return throwExpressException(401, 'no token sent', next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    if (!auth1.success) return throwExpressException(auth1.errorCode, auth1.errorMessage, next);

    //class exist check done by auth

    const assignment = await prisma.assignment.findUnique({
        where: {
            id: assignmentId.data,
            class_id: classId.data
        }
    });
    if (!assignment) return throwExpressException(404, "assignment not found", next);

    const group = await prisma.group.findUnique({
        where: {
            id: groupId.data,
            assignment_id: assignmentId.data,
        }
    });
    if (!group) return throwExpressException(404, "group not found", next);

    const student = await prisma.student.findUnique({
        where: {id: studentId.data}
    });
    if (!student) return throwExpressException(404, "student not found", next);

    const studentGroup = await prisma.studentGroup.findFirst({
        where: {
            student_id: studentId.data,
            group_id: groupId.data
        }
    });
    if (!studentGroup) return throwExpressException(400, "student not in group", next);

    await prisma.studentGroup.deleteMany({
        where: {
            student_id: studentId.data,
            group_id: groupId.data
        }
    });

    res.status(200).send();
}
