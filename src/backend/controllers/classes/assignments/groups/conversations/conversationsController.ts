import {NextFunction, Request, Response} from "express";
import {throwExpressException} from "../../../../../exceptions/ExpressException.ts";
import {z} from "zod";
import {
    doesTokenBelongToStudentInClass,
    doesTokenBelongToTeacherInClass,
    getJWToken
} from "../../../../authentication/extraAuthentication.ts";
import {prisma} from "../../../../../index.ts";
import {conversationLink, splitIdToString} from "../../../../../help/links.ts";
import {zLearingobjectLink} from "../../../../../help/validation.ts";


export async function getGroupConversations(req: Request, res: Response, next: NextFunction) {
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

    const conversations = await prisma.conversation.findMany({
        where: {
            assignment: assignmentId.data,
            group: groupId.data
        }
    });
    const conversationLinks = conversations.map((conv) =>
        conversationLink(classId.data, assignmentId.data, groupId.data, conv.id)
    );
    res.status(200).send({conversations: conversationLinks});
}

export async function postGroupConversation(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const assignmentId = z.coerce.number().safeParse(req.params.assignmentId);
    const groupId = z.coerce.number().safeParse(req.params.groupId);
    const title = z.string().safeParse(req.body.title);
    const learningobjectLink = zLearingobjectLink.safeParse(req.body.learningobject);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!assignmentId.success) return throwExpressException(400, "invalid assignmentId", next);
    if (!groupId.success) return throwExpressException(400, "invalid groupId", next);
    if (!title.success) return throwExpressException(400, "invalid title", next);
    if (!learningobjectLink.success) return throwExpressException(400, "invalid learningobjectLink", next);

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

    const learningobject = await prisma.learningObject.findUnique({
        where: {uuid: splitIdToString(learningobjectLink.data)}
    });
    if (!learningobject) return throwExpressException(404, "learning object not found", next);

    const conversation = await prisma.conversation.create({
        data: {
            title: title.data,
            learning_object: learningobject.uuid,
            group: groupId.data,
            assignment: assignmentId.data,
        }
    });
    res.status(200).send({
        conversation: conversationLink(classId.data, assignmentId.data, groupId.data, conversation.id)
    });
}

export async function getConversation(req: Request, res: Response, next: NextFunction) {
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

    const conversation = await prisma.conversation.findUnique({
        where: {
            id: conversationId.data,
            assignment: assignmentId.data,
            group: groupId.data,
            assignments: {
                class: classId.data
            }
        }
    });
    if (!conversation) return throwExpressException(404, "conversation not found", next);
    res.status(200).send({
        title: conversation.title,
        group: conversation.group,
        messages: conversationLink(classId.data, assignmentId.data, groupId.data, conversationId.data) + "/messages"
    });
}

export async function deleteConversation(req: Request, res: Response, next: NextFunction) {
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

    const conversation = await prisma.conversation.findUnique({
        where: {
            id: conversationId.data,
            assignment: assignmentId.data,
            group: groupId.data,
            assignments: {
                class: classId.data
            }
        }
    });
    if (!conversation) return throwExpressException(404, "conversation not found", next);

    await prisma.conversation.deleteMany({
        where: {
            id: conversationId.data,
            assignment: assignmentId.data,
            group: groupId.data,
            assignments: {
                class: classId.data
            }
        }
    });
    res.status(200).send();
}
