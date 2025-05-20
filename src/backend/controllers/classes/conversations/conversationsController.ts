import { NextFunction, Request, Response } from "express";
import { doesTokenBelongToTeacherInClass, getJWToken } from "../../authentication/extraAuthentication.ts";
import { throwExpressException } from "../../../exceptions/ExpressException.ts";
import { z } from "zod";
import { prisma } from "../../../index.ts";
import { conversationLink } from "../../../help/links.ts";

export async function getClassConversations(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    if (!classId.success) return throwExpressException(400, "invalid classId", next);

    const JWToken = getJWToken(req, next);
    if (!JWToken) return throwExpressException(401, 'no token sent', next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    if (!auth1.success) return throwExpressException(auth1.errorCode, auth1.errorMessage, next);

    //class exist check done by auth

    const conversations = await prisma.conversation.findMany({
        where: { assignments: { class_id: classId.data } }
    });
    const conversationLinks = conversations.map(conv =>
        conversationLink(classId.data, conv.assignment_id, conv.group_id, conv.id)
    );
    res.status(200).send({ conversations: conversationLinks });
}
