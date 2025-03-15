import {NextFunction, Request, Response} from "express";
import {prisma} from "../../../../index.ts";
import {z} from "zod";
import {throwExpressException} from "../../../../exceptions/ExpressException.ts";
import {doesTokenBelongToTeacherInClass, getJWToken,} from "../../../authentication/extraAuthentication.ts";
import {conversationLink} from "../../../../help/links.ts";

export async function getAssignmentConversations(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const assignmentId = z.coerce.number().safeParse(req.params.assignmentId);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!assignmentId.success) return throwExpressException(400, "invalid assignmentId", next);

    const JWToken = getJWToken(req, next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    if (!auth1.success) return throwExpressException(403, auth1.errorMessage, next);

    const assingment = await prisma.assignment.findUnique({
        where: {
            id: assignmentId.data,
            class: classId.data,
        }
    });
    if (!assingment) return throwExpressException(404, "assignment not found", next);

    const conversations = await prisma.conversation.findMany({
        where: {assignment: assignmentId.data}
    });
    const conversationLinks = conversations.map(conv =>
        conversationLink(classId.data, conv.assignment, conv.group, conv.id)
    );
    res.status(200).send({conversaties: conversationLinks});
}
