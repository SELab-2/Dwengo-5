import {NextFunction, Request, Response} from "express";
import {prisma} from "../../../../../../index.ts";
import {z} from "zod";
import {throwExpressException} from "../../../../../../exceptions/ExpressException.ts";
import {
    doesTokenBelongToStudentInGroup,
    doesTokenBelongToTeacherInClass,
    getJWToken
} from "../../../../../authentication/extraAuthentication.ts";
import {splitId, studentLink, teacherLink} from "../../../../../../help/links.ts";
import {studentRexp, zStudentOrTeacherLink} from "../../../../../../help/validation.ts";


export async function getConversationMessages(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const assignmentId = z.coerce.number().safeParse(req.params.assignmentId);
    const groupId = z.coerce.number().safeParse(req.params.groupId);
    const conversationId = z.coerce.number().safeParse(req.params.conversationId);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!assignmentId.success) return throwExpressException(400, "invalid assignmentId", next);
    if (!groupId.success) return throwExpressException(400, "invalid groupId", next);
    if (!conversationId.success) return throwExpressException(400, "invalid conversationId", next);

    const JWToken = getJWToken(req, next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    const auth2 = await doesTokenBelongToStudentInGroup(groupId.data, JWToken);
    if (!(auth1.success || auth2.success))
        return throwExpressException(403, auth1.errorMessage + " and " + auth2.errorMessage, next);

    //class exist check done by auth

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
        }
    });
    if (!group) return throwExpressException(404, "group not found", next);

    const conversation = await prisma.conversation.findUnique({
        where: {
            id: conversationId.data,
            group: groupId.data,
        }
    });
    if (!conversation) return throwExpressException(404, "conversation not found", next);

    const messages = await prisma.message.findMany({
        where: {conversation: conversationId.data}
    });
    const messageObjects = messages.map((message) => ({
        content: message.content,
        zender: message.is_student ? studentLink(message.student!) : teacherLink(message.teacher!)
    }));
    res.status(200).send({messages: messageObjects});
}

export async function postConversationMessage(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const assignmentId = z.coerce.number().safeParse(req.params.assignmentId);
    const groupId = z.coerce.number().safeParse(req.params.groupId);
    const conversationId = z.coerce.number().safeParse(req.params.conversationId);
    const content = z.string().safeParse(req.body.bericht);
    const senderLink = zStudentOrTeacherLink.safeParse(req.body.zender);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!assignmentId.success) return throwExpressException(400, "invalid assignmentId", next);
    if (!groupId.success) return throwExpressException(400, "invalid groupId", next);
    if (!conversationId.success) return throwExpressException(400, "invalid conversationId", next);
    if (!senderLink.success) return throwExpressException(400, "invalid senderLink", next);
    if (!content.success) return throwExpressException(400, "invalid content", next);

    const JWToken = getJWToken(req, next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    const auth2 = await doesTokenBelongToStudentInGroup(groupId.data, JWToken);
    if (!(auth1.success || auth2.success))
        return throwExpressException(403, auth1.errorMessage + " and " + auth2.errorMessage, next);

    //class exist check done by auth

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
            assignment: assignmentId.data
        }
    });
    if (!group) return throwExpressException(404, "group not found", next);

    const conversation = await prisma.conversation.findUnique({
        where: {
            id: conversationId.data,
            group: groupId.data,
        }
    });
    if (!conversation) return throwExpressException(404, "conversation not found", next);

    const isStudent = studentRexp.test(senderLink.data);
    const senderId = splitId(senderLink.data);
    await prisma.message.create({
        data: {
            content: content.data,
            is_student: isStudent,
            student: isStudent ? senderId : null,
            teacher: isStudent ? null : senderId,
            date: new Date(Date.now()),
            conversation: conversationId.data
        },
    });
    res.status(200).send();
}

