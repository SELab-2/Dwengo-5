import {NextFunction, Request, Response} from "express";
import {prisma} from "../../../../../../index.ts";
import {z} from "zod";
import {throwExpressException} from "../../../../../../exceptions/ExpressException.ts";
import {doesTokenBelongToTeacherInClass, getJWToken} from "../../../../../authentication/extraAuthentication.ts";


// GET /classes/:classId/assignments/:assignmentId/groups/:groupId/conversations/:conversationId/messages
export async function conversatieBerichten(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const assignmentId = z.coerce.number().safeParse(req.params.assignmentId);
    const groupId = z.coerce.number().safeParse(req.params.groupId);
    const conversationId = z.coerce.number().safeParse(req.params.conversationId);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!assignmentId.success) return throwExpressException(400, "invalid assignmentId", next);
    if (!groupId.success) return throwExpressException(400, "invalid groupId", next);
    if (!conversationId.success) return throwExpressException(400, "invalid conversationId", next);

    // authentication
    const JWToken = getJWToken(req, next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    if (!(auth1.success)) return throwExpressException(403, auth1.errorMessage, next);

    // controlleren of de groep tot de juiste klas behoort
    const group = await prisma.group.findUnique({
        where: {id: groupId.data}
    });
    if (!group || group.class !== classId.data) return throwExpressException(400, "group doesn't belong to this class.", next);

    const conversation = await prisma.conversation.findUnique({
        where: {
            id: conversationId.data,
            group: groupId.data,
            assignment: assignmentId.data
        }
    });
    if (!conversation) return throwExpressException(404, "conversation not found", next);

    const messages = await prisma.message.findMany({
        where: {
            conversation: conversationId.data
        }
    });

    const messageResults = messages.map((message) => {
        const senderUrl: string = (message.is_student ? `/leerlingen/${message.student}` : `/leerkrachten/${message.teacher}`);

        return {
            content: message.content,
            zender: senderUrl
        };
    });
    res.status(200).send({berichten: messageResults});
}

// POST /classes/:classId/assignments/:assignmentId/groups/:groupId/conversations/:conversationId/messages
export async function stuurInConversatie(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const assignmentId = z.coerce.number().safeParse(req.params.assignmentId);
    const groupId = z.coerce.number().safeParse(req.params.groupId);
    const conversationId = z.coerce.number().safeParse(req.params.conversationId);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!assignmentId.success) return throwExpressException(400, "invalid assignmentId", next);
    if (!groupId.success) return throwExpressException(400, "invalid groupId", next);
    if (!conversationId.success) return throwExpressException(400, "invalid conversationId", next);

    const messageContent = z.string().safeParse(req.body.bericht);
    const sender = z.string().trim().regex(/^\/(leerlingen|leerkrachten)\/\d+$/).safeParse(req.body.zender);

    if (!sender.success) return throwExpressException(400, "invalid sender url: should be /students/{id} or /teachers/{id}", next);
    if (!messageContent.success) return throwExpressException(400, "invalid message content", next);

    const senderParts = sender.data.split("/");
    const senderType = senderParts[1]; // "students" or "teachers"
    const senderId = parseInt(senderParts[2], 10);

    const isStudent = senderType === "leerlingen";

    // authentication
    const JWToken = getJWToken(req, next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    if (!(auth1.success)) return throwExpressException(403, auth1.errorMessage, next);

    // controlleer of de groep tot de juiste klas behoord
    const group = await prisma.group.findUnique({
        where: {id: groupId.data}
    });
    if (!group || group.class !== classId.data) return throwExpressException(400, "group doesn't belong to this class", next);

    // controlleer of de conversatie bestaat
    const conversation = await prisma.conversation.findUnique({
        where: {
            id: conversationId.data,
            assignment: assignmentId.data,
            group: groupId.data
        }
    });
    if (!conversation) return throwExpressException(404, "conversation not found", next);

    // hoogste index van de conversatie opvragen
    const lastMessage = await prisma.message.findFirst({
        where: {conversation: conversationId.data},
        orderBy: {index: "desc"}
    });
    const index = lastMessage ? lastMessage.index + 1 : 0;

    const message = await prisma.message.create({
        data: {
            content: messageContent.data,
            is_student: isStudent,
            student: isStudent ? senderId : null,
            teacher: isStudent ? null : senderId,
            index: index,
            conversation: conversationId.data
        },
        select: {
            id: true
        }
    });

    res.status(200).send();
}

