import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../../../../index.ts";
import { z } from "zod";
import { throwExpressException } from "../../../../../../exceptions/ExpressException.ts";
import {
    doesTokenBelongToStudentInGroup,
    doesTokenBelongToTeacherInClass,
    getJWToken,
} from "../../../../../authentication/extraAuthentication.ts";
import {
    messageLink,
    splitId,
    userLink,
} from "../../../../../../help/links.ts";
import { zUserLink } from "../../../../../../help/validation.ts";

export async function getConversationMessages(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const assignmentId = z.coerce.number().safeParse(req.params.assignmentId);
    const groupId = z.coerce.number().safeParse(req.params.groupId);
    const conversationId = z.coerce
        .number()
        .safeParse(req.params.conversationId);

    if (!classId.success)
        return throwExpressException(400, "invalid classId", next);
    if (!assignmentId.success)
        return throwExpressException(400, "invalid assignmentId", next);
    if (!groupId.success)
        return throwExpressException(400, "invalid groupId", next);
    if (!conversationId.success)
        return throwExpressException(400, "invalid conversationId", next);

    const JWToken = getJWToken(req);
    if (!JWToken) return throwExpressException(401, "no token sent", next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    const auth2 = await doesTokenBelongToStudentInGroup(groupId.data, JWToken);
    if (!(auth1.success || auth2.success))
        return throwExpressException(
            auth1.errorCode < 300 ? auth2.errorCode : auth1.errorCode,
            `${auth1.errorMessage} and ${auth2.errorMessage}`,
            next
        );

    //class exist check done by auth

    const assignment = await prisma.assignment.findFirst({
        where: {
            id: assignmentId.data,
            class_id: classId.data,
        },
    });
    if (!assignment)
        return throwExpressException(404, "assignment not found", next);

    const group = await prisma.group.findFirst({
        where: {
            id: groupId.data,
        },
    });
    if (!group) return throwExpressException(404, "group not found", next);

    const conversation = await prisma.conversation.findUnique({
        where: {
            id: conversationId.data,
            group_id: groupId.data,
        },
    });
    if (!conversation)
        return throwExpressException(404, "conversation not found", next);

    const messages = await prisma.message.findMany({
        where: { conversation_id: conversationId.data },
    });
    const messageLinks = messages.map((message) =>
        messageLink(
            classId.data,
            assignmentId.data,
            groupId.data,
            conversationId.data,
            message.id
        )
    );
    res.status(200).send({ messages: messageLinks });
}

export async function getConversationMessage(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const assignmentId = z.coerce.number().safeParse(req.params.assignmentId);
    const groupId = z.coerce.number().safeParse(req.params.groupId);
    const conversationId = z.coerce
        .number()
        .safeParse(req.params.conversationId);
    const messageId = z.coerce.number().safeParse(req.params.messageId);

    if (!classId.success)
        return throwExpressException(400, "invalid classId", next);
    if (!assignmentId.success)
        return throwExpressException(400, "invalid assignmentId", next);
    if (!groupId.success)
        return throwExpressException(400, "invalid groupId", next);
    if (!conversationId.success)
        return throwExpressException(400, "invalid conversationId", next);
    if (!messageId.success)
        return throwExpressException(400, "invalid messageId", next);

    const JWToken = getJWToken(req);
    if (!JWToken) return throwExpressException(401, "no token sent", next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    const auth2 = await doesTokenBelongToStudentInGroup(groupId.data, JWToken);
    if (!(auth1.success || auth2.success))
        return throwExpressException(
            403,
            auth1.errorMessage + " and " + auth2.errorMessage,
            next
        );

    //class exist check done by auth

    const assignment = await prisma.assignment.findFirst({
        where: {
            id: assignmentId.data,
            class_id: classId.data,
        },
    });
    if (!assignment)
        return throwExpressException(404, "assignment not found", next);

    const group = await prisma.group.findFirst({
        where: {
            id: groupId.data,
        },
    });
    if (!group) return throwExpressException(404, "group not found", next);

    const conversation = await prisma.conversation.findUnique({
        where: {
            id: conversationId.data,
            group_id: groupId.data,
        },
    });
    if (!conversation)
        return throwExpressException(404, "conversation not found", next);

    const message = await prisma.message.findUnique({
        where: { id: messageId.data, conversation_id: conversationId.data },
    });
    if (!message) return throwExpressException(404, "message not found", next);

    res.status(200).send({
        content: message.content,
        postTime: message.date,
        sender: userLink(message.user_id),
    });
}

export async function postConversationMessage(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const assignmentId = z.coerce.number().safeParse(req.params.assignmentId);
    const groupId = z.coerce.number().safeParse(req.params.groupId);
    const conversationId = z.coerce
        .number()
        .safeParse(req.params.conversationId);
    const content = z.string().safeParse(req.body.content);
    const senderLink = zUserLink.safeParse(req.body.sender);

    if (!classId.success)
        return throwExpressException(400, "invalid classId", next);
    if (!assignmentId.success)
        return throwExpressException(400, "invalid assignmentId", next);
    if (!groupId.success)
        return throwExpressException(400, "invalid groupId", next);
    if (!conversationId.success)
        return throwExpressException(400, "invalid conversationId", next);
    if (!senderLink.success)
        return throwExpressException(400, "invalid senderLink", next);
    if (!content.success)
        return throwExpressException(400, "invalid content", next);

    const JWToken = getJWToken(req);
    if (!JWToken) return throwExpressException(401, "no token sent", next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    const auth2 = await doesTokenBelongToStudentInGroup(groupId.data, JWToken);
    if (!(auth1.success || auth2.success))
        return throwExpressException(
            auth1.errorCode < 300 ? auth2.errorCode : auth1.errorCode,
            `${auth1.errorMessage} and ${auth2.errorMessage}`,
            next
        );

    //class exist check done by auth

    const assignment = await prisma.assignment.findUnique({
        where: {
            id: assignmentId.data,
            class_id: classId.data,
        },
    });
    if (!assignment)
        return throwExpressException(404, "assignment not found", next);

    const group = await prisma.group.findUnique({
        where: {
            id: groupId.data,
            assignment_id: assignmentId.data,
        },
    });
    if (!group) return throwExpressException(404, "group not found", next);

    const conversation = await prisma.conversation.findUnique({
        where: {
            id: conversationId.data,
            group_id: groupId.data,
        },
    });
    if (!conversation)
        return throwExpressException(404, "conversation not found", next);

    const senderId = splitId(senderLink.data);
    let message!: {
        id: number;
        content: string;
        date: Date;
        user_id: number;
        conversation_id: number;
    };
    await prisma.$transaction(async (tx) => {
        message = await tx.message.create({
            data: {
                content: content.data,
                user_id: senderId,
                date: new Date(Date.now()),
                conversation_id: conversationId.data,
            },
        });
        const teacherIds = [
            ...new Set(
                (
                    await tx.message.findMany({
                        where: {
                            user: { teacher: { some: {} } },
                            conversation_id: conversationId.data,
                        },
                    })
                ).map((message) => message.user_id)
            ),
        ];
        const students = await tx.student.findMany({
            where: { groups: { some: { group_id: groupId.data } } },
        });
        await tx.notification.createMany({
            data: teacherIds.map((teacherId) => ({
                user_id: teacherId,
                read: false,
                type: "QUESTION",
            })),
        });
        await tx.notification.createMany({
            data: students.map((student) => ({
                user_id: student.id,
                read: false,
                type: "QUESTION",
            })),
        });
    });
    res.status(200).send({
        message: messageLink(
            classId.data,
            assignmentId.data,
            groupId.data,
            conversationId.data,
            message.id
        ),
    });
}

export async function deleteConversationMessage(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const assignmentId = z.coerce.number().safeParse(req.params.assignmentId);
    const groupId = z.coerce.number().safeParse(req.params.groupId);
    const conversationId = z.coerce
        .number()
        .safeParse(req.params.conversationId);
    const messageId = z.coerce.number().safeParse(req.params.messageId);

    if (!classId.success)
        return throwExpressException(400, "invalid classId", next);
    if (!assignmentId.success)
        return throwExpressException(400, "invalid assignmentId", next);
    if (!groupId.success)
        return throwExpressException(400, "invalid groupId", next);
    if (!conversationId.success)
        return throwExpressException(400, "invalid conversationId", next);
    if (!messageId.success)
        return throwExpressException(400, "invalid messageId", next);

    const JWToken = getJWToken(req);
    if (!JWToken) return throwExpressException(401, "no token sent", next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    const auth2 = await doesTokenBelongToStudentInGroup(groupId.data, JWToken);
    if (!(auth1.success || auth2.success))
        return throwExpressException(
            403,
            auth1.errorMessage + " and " + auth2.errorMessage,
            next
        );

    //class exist check done by auth

    const assignment = await prisma.assignment.findUnique({
        where: {
            id: assignmentId.data,
            class_id: classId.data,
        },
    });
    if (!assignment)
        return throwExpressException(404, "assignment not found", next);

    const group = await prisma.group.findUnique({
        where: {
            id: groupId.data,
        },
    });
    if (!group) return throwExpressException(404, "group not found", next);

    const conversation = await prisma.conversation.findUnique({
        where: {
            id: conversationId.data,
            group_id: groupId.data,
        },
    });
    if (!conversation)
        return throwExpressException(404, "conversation not found", next);

    await prisma.message.deleteMany({
        where: { id: messageId.data, conversation_id: conversationId.data },
    });
    res.status(200).send();
}
