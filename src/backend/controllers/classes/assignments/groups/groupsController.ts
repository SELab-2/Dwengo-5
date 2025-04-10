import {NextFunction, Request, Response} from "express";
import {throwExpressException} from "../../../../exceptions/ExpressException.ts";
import {prisma} from "../../../../index.ts";
import {
    doesTokenBelongToStudentInAssignment,
    doesTokenBelongToTeacherInClass,
    getJWToken
} from "../../../authentication/extraAuthentication.ts";
import {z} from "zod";
import {groupLink, splitId} from "../../../../help/links.ts";
import {zStudentLink} from "../../../../help/validation.ts";

export async function getAssignmentGroup(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const assignmentId = z.coerce.number().safeParse(req.params.assignmentId);
    const groupId = z.coerce.number().safeParse(req.params.groupId);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!assignmentId.success) return throwExpressException(400, "invalid assignmentId", next);
    if (!groupId.success) return throwExpressException(400, "invalid groupId", next);

    const JWToken = getJWToken(req, next);
    if (!JWToken) return throwExpressException(401, 'no token sent', next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    const auth2 = await doesTokenBelongToStudentInAssignment(assignmentId.data, JWToken);
    if (!(auth1.success || auth2.success))
        return throwExpressException(auth1.errorCode < 300 ? auth2.errorCode : auth1.errorCode, `${auth1.errorMessage} and ${auth2.errorMessage}`, next);

    //class and assignment exist check done by auth

    const group = await prisma.group.findUnique({
        where: {
            id: groupId.data
        }
    });
    if (!group) return throwExpressException(404, "group not found", next);
    res.status(200).send({
        links: {
            conversations: req.originalUrl + "/conversations",
            students: req.originalUrl + "/students"
        }
    });
}

export async function getAssignmentGroups(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const assignmentId = z.coerce.number().safeParse(req.params.assignmentId);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!assignmentId.success) return throwExpressException(400, "invalid assignmentId", next);

    const JWToken = getJWToken(req, next);
    if (!JWToken) return throwExpressException(401, 'no token sent', next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    const auth2 = await doesTokenBelongToStudentInAssignment(assignmentId.data, JWToken);
    if (!(auth1.success || auth2.success))
        return throwExpressException(auth1.errorCode < 300 ? auth2.errorCode : auth1.errorCode, `${auth1.errorMessage} and ${auth2.errorMessage}`, next);

    //class and assignment exist check done by auth

    const groups = await prisma.group.findMany({
        where: {
            class: classId.data,
            assignment: assignmentId.data
        }
    });
    const groupLinks = groups.map(group =>
        groupLink(classId.data, group.assignment, group.id)
    );
    res.status(200).send({groups: groupLinks});
}


export async function postAssignmentGroup(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const assignmentId = z.coerce.number().safeParse(req.params.assignmentId);
    const studentLinks = z.array(zStudentLink).safeParse(req.body.students);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!assignmentId.success) return throwExpressException(400, "invalid assignmentId", next);
    if (!studentLinks.success) return throwExpressException(400, "invalid studentLinks", next);

    const JWToken = getJWToken(req, next);
    if (!JWToken) return throwExpressException(401, 'no token sent', next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    if (!auth1.success) return throwExpressException(auth1.errorCode, auth1.errorMessage, next);

    //class exist check done by auth

    const assignment = await prisma.assignment.findUnique({
        where: {
            id: assignmentId.data,
            class: classId.data
        },
    });
    if (!assignment) return throwExpressException(404, "assignment not found", next);

    let studentNot;
    studentLinks.data.forEach((studentLink) => {
        const student = prisma.student.findUnique({
            where: {id: splitId(studentLink)}
        });
        if (!student) studentNot = true;
    });
    if (studentNot) return throwExpressException(404, "student not found", next);

    let group;
    await prisma.$transaction(async (tx) => {
        group = await tx.group.create({
            data: {
                assignment: assignmentId.data,
                class: classId.data,
                students_groups: {
                    create: studentLinks.data.map(student =>
                        ({
                            students_id: splitId(student),
                        }))
                }
            }
        });
        /*
        await tx.notification.createMany({
            data: studentLinks.data.map(studentLink => ({
                read: false,
                student: splitId(studentLink),
                type: "INVITE",
            }))
        })*/
    })
    res.status(200).send({group: groupLink(classId.data, assignmentId.data, group!.id)});
}

export async function deleteAssignmentGroup(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const assignmentId = z.coerce.number().safeParse(req.params.assignmentId);
    const groupId = z.coerce.number().safeParse(req.params.groupId);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!assignmentId.success) return throwExpressException(400, "invalid assignmentId", next);
    if (!groupId.success) return throwExpressException(400, "invalid groupId", next);

    const JWToken = getJWToken(req, next);
    if (!JWToken) return throwExpressException(401, 'no token sent', next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    if (!auth1.success) return throwExpressException(auth1.errorCode, auth1.errorMessage, next);

    //class exist check done by auth

    const assignment = await prisma.assignment.findUnique({
        where: {
            id: assignmentId.data,
            class: classId.data
        }
    });
    if (!assignment) return throwExpressException(404, "assignment not found", next);

    await prisma.group.deleteMany({
        where: {id: groupId.data}
    });

    res.status(200).send();
}
