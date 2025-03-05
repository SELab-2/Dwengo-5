import {Request, Response} from "express";
import {doesTokenBelongToTeacherInClass, getJWToken} from "../../authenticatie/extra_auth_functies.ts";
import {ExpressException} from "../../../exceptions/ExpressException.ts";
import {z} from "zod";
import {prisma, website_base} from "../../../index.ts";

export async function klas_conversaties(req: Request, res: Response) {
    const classId = z.number().safeParse(req.params.klas_id);
    if (!classId.success) throw new ExpressException(400, "invalid classId");

    const JWToken = getJWToken(req);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    if (!auth1.success) throw new ExpressException(403, auth1.errorMessage);

    const conversations = await prisma.conversation.findMany({
        where: {assignments: {classes: {id: classId.data}}}
    });
    const conversationLinks = conversations.map(conversation =>
        website_base + `/klassen/${classId}/opdrachten/${conversation.assignment}/groepen/${conversation.group}/conversaties/${conversation.id}`);
    res.status(200).send(conversationLinks);
}