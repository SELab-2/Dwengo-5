import {NextFunction, Request, Response} from "express";
import {throwExpressException} from "../../../../../exceptions/ExpressException.ts";
import {z} from "zod";
import {
    doesTokenBelongToStudentInClass,
    doesTokenBelongToTeacherInClass,
    getJWToken
} from "../../../../authentication/extraAuthentication.ts";
import {prisma} from "../../../../../index.ts";


const bodyConversatieSchema = z.object({
    titel: z.string(),
    leerobject: z.string().trim().regex(/^\/leerobjecten\/[a-zA-Z0-9-]+$/, "invalid learningObject")
});


export async function getGroupConversations(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const assignmentId = z.coerce.number().safeParse(req.params.assignmentId);
    const groupId = z.coerce.number().safeParse(req.params.groupId);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!assignmentId.success) return throwExpressException(400, "invalid assignmentId", next);
    if (!groupId.success) return throwExpressException(400, "invalid groupId", next);

    // authentication
    const JWToken = getJWToken(req, next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    const auth2 = await doesTokenBelongToStudentInClass(classId.data, JWToken);
    if (!(auth1.success || auth2.success))
        return throwExpressException(403, auth1.errorMessage + " and " + auth2.errorMessage, next);

    // alle conversations over een opdracht van een groep opvragen
    const conversaties = await prisma.conversation.findMany({
        where: {
            assignment: assignmentId.data,
            group: groupId.data
        },
        select: {
            id: true,
        }
    });

    const conversationLinks = conversaties.map((conversatie) =>
        `/klassen/${classId.data}/opdrachten/${assignmentId.data}/groepen/${groupId.data}/conversaties/${conversatie.id}`
    );

    res.status(200).send({conversaties: conversationLinks});
}

export async function postGroupConversation(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const assignmentId = z.coerce.number().safeParse(req.params.assignmentId);
    const groupId = z.coerce.number().safeParse(req.params.groupId);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!assignmentId.success) return throwExpressException(400, "invalid assignmentId", next);
    if (!groupId.success) return throwExpressException(400, "invalid groupId", next);

    const bodyResult = bodyConversatieSchema.safeParse(req.body);
    if (!bodyResult.success) return throwExpressException(400, "wrong body", next);

    const titel: string = bodyResult.data.titel;
    const leerobjectUrl: string = bodyResult.data.leerobject;
    const parts = leerobjectUrl.split("/");
    const leerobjectId: string = parts[parts.length - 1];

    // authentication
    const JWToken = getJWToken(req, next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    const auth2 = await doesTokenBelongToStudentInClass(classId.data, JWToken);
    if (!(auth1.success || auth2.success))
        return throwExpressException(403, auth1.errorMessage + " and " + auth2.errorMessage, next);

    // leerobject opvragen om de uuid te krijgen
    const leerObject = await prisma.learningObject.findUnique({
        where: {
            uuid: leerobjectId
        },
        select: {
            uuid: true
        }
    });
    if (!leerObject) return throwExpressException(404, "learning object not found", next);

    // controlleer of de groep en opdracht bestaan
    const group = await prisma.group.findUnique({
        where: {
            id: groupId.data,
            assignment: assignmentId.data
        }
    });
    if (!group) return throwExpressException(404, "group not found", next);

    // voeg conversatie over een opdracht van een groep toe
    const conversatie = await prisma.conversation.create({
        data: {
            title: titel,
            learning_object: leerObject.uuid,
            group: groupId.data,
            assignment: assignmentId.data,
        }
    });

    res.status(200).send({conversatie: `/klassen/${classId.data}/opdrachten/${assignmentId.data}/groepen/${groupId.data}/conversaties/${conversatie.id}`});
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

    // authentication
    const JWToken = getJWToken(req, next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    const auth2 = await doesTokenBelongToStudentInClass(classId.data, JWToken);
    if (!(auth1.success || auth2.success))
        return throwExpressException(403, auth1.errorMessage + " and " + auth2.errorMessage, next);

    // één conversatie over een opdracht van een groep opvragen
    const conversatie = await prisma.conversation.findUnique({
        where: {
            id: conversationId.data,
            assignment: assignmentId.data,
            group: groupId.data
        }
    });

    if (!conversatie) return throwExpressException(404, "conversation not found", next);

    res.status(200).send({
        title: conversatie.title,
        groep: conversatie.group,
        berichten: `/klassen/${classId.data}/opdrachten/${assignmentId.data}/groepen/${groupId.data}/conversaties/${conversationId.data}/berichten`
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

    // authentication
    const JWToken = getJWToken(req, next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    const auth2 = await doesTokenBelongToStudentInClass(classId.data, JWToken);
    if (!(auth1.success || auth2.success))
        return throwExpressException(403, auth1.errorMessage + " and " + auth2.errorMessage, next);

    // controlleren of de conversatie bestaat
    const conversation = await prisma.conversation.findUnique({
        where: {
            id: conversationId.data,
            assignment: assignmentId.data,
            group: groupId.data
        }
    });
    if (!conversation) return throwExpressException(404, "conversation not found", next);

    // verwijder een conversatie over een opdracht van een groep
    await prisma.conversation.delete({
        where: {
            id: conversationId.data,
            assignment: assignmentId.data,
            group: groupId.data
        }
    });

    res.status(200).send();
}
