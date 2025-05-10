import {NextFunction, Request, Response} from "express";
import {prisma} from "../../../../index.ts";
import {z} from "zod";
import {throwExpressException} from "../../../../exceptions/ExpressException.ts";
import {conversationLink} from "../../../../help/links.ts";
import {
    doesTokenBelongToStudent,
    doesTokenBelongToStudentInClass,
    doesTokenBelongToTeacherInClass,
    getJWToken
} from "../../../authentication/extraAuthentication.ts";

export async function getStudentConversations(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const studentId = z.coerce.number().safeParse(req.params.studentId);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!studentId.success) return throwExpressException(400, "invalid studentId", next);

    const JWToken = getJWToken(req, next);
    if (!JWToken) return throwExpressException(401, 'no token sent', next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    const auth2 = await doesTokenBelongToStudentInClass(classId.data, JWToken);
    const auth3 = await doesTokenBelongToStudent(studentId.data, JWToken);
    if (!(auth1.success || auth2.success || auth3.success))
        return throwExpressException(
            auth1.errorCode < 300 ? (auth2.errorCode < 300 ? auth3.errorCode : auth2.errorCode) : auth1.errorCode,
            `${auth1.errorMessage} and ${auth2.errorMessage} and ${auth3.errorMessage}`,
            next);

    //class and student exist check done by auth

    const conversations = await prisma.conversation.findMany({
        where: {
            groups: {
                students_groups: {
                    some: {students_id: studentId.data}
                }
            },
        },
    });
    const conversationsLinks = conversations.map(conv =>
        conversationLink(classId.data, conv.assignment, conv.group, conv.id)
    );
    res.status(200).send({conversations: conversationsLinks});
}
