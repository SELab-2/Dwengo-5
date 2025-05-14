import {NextFunction, Request, Response} from "express";
import {throwExpressException} from "../../../../../exceptions/ExpressException.ts";
import {z} from "zod";
import {
    doesTokenBelongToStudentInGroup,
    doesTokenBelongToTeacherInClass,
    getJWToken
} from "../../../../authentication/extraAuthentication.ts";
import {JWT_SECRET, prisma} from "../../../../../index.ts";
import {conversationLink, groupLink, learningobjectLink, splitIdToString} from "../../../../../help/links.ts";
import {zLearningobjectLink} from "../../../../../help/validation.ts";
import jwt, {JwtPayload} from "jsonwebtoken";


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
    if (!JWToken) return throwExpressException(401, 'no token sent', next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    const auth2 = await doesTokenBelongToStudentInGroup(groupId.data, JWToken);
    if (!(auth1.success || auth2.success))
        return throwExpressException(auth1.errorCode < 300 ? auth2.errorCode : auth1.errorCode, `${auth1.errorMessage} and ${auth2.errorMessage}`, next);

    //class exist check done by auth

    const assignment = await prisma.assignment.findFirst({
        where: {
            id: assignmentId.data,
            class_id: classId.data
        }
    });
    if (!assignment) return throwExpressException(404, "assignment not found", next);

    const group = await prisma.group.findFirst({
        where: {
            id: groupId.data,
            assignment_id: assignmentId.data
        }
    });
    if (!group) return throwExpressException(404, "group not found", next);

    const conversation = await prisma.conversation.findUnique({
        where: {
            id: conversationId.data,
            group_id: groupId.data
        }
    });
    if (!conversation) return throwExpressException(404, "conversation not found", next);

    res.status(200).send({
        title: conversation.title,
        group: groupLink(classId.data, assignmentId.data, groupId.data),
        learningobject: learningobjectLink(conversation.learning_object_id),
        links: {
            messages: req.originalUrl + "/messages"
        }
    });
}

export async function getGroupConversations(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const assignmentId = z.coerce.number().safeParse(req.params.assignmentId);
    const groupId = z.coerce.number().safeParse(req.params.groupId);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!assignmentId.success) return throwExpressException(400, "invalid assignmentId", next);
    if (!groupId.success) return throwExpressException(400, "invalid groupId", next);

    const JWToken = getJWToken(req, next);
    if (!JWToken) return throwExpressException(401, 'no token sent', next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    const auth2 = await doesTokenBelongToStudentInGroup(groupId.data, JWToken);
    if (!(auth1.success || auth2.success))
        return throwExpressException(auth1.errorCode < 300 ? auth2.errorCode : auth1.errorCode, `${auth1.errorMessage} and ${auth2.errorMessage}`, next);

    //class and group exist check done by auth

    const assignment = await prisma.assignment.findFirst({
        where: {
            id: assignmentId.data,
            class_id: classId.data
        }
    });
    if (!assignment) return throwExpressException(404, "assignment not found", next);

    const conversations = await prisma.conversation.findMany({
        where: {
            assignment_id: assignmentId.data,
            group_id: groupId.data
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
    const learningobjectLink = zLearningobjectLink.safeParse(req.body.learningobject);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!assignmentId.success) return throwExpressException(400, "invalid assignmentId", next);
    if (!groupId.success) return throwExpressException(400, "invalid groupId", next);
    if (!title.success) return throwExpressException(400, "invalid title", next);
    if (!learningobjectLink.success) return throwExpressException(400, "invalid learningObjectLink", next);

    const JWToken = getJWToken(req, next);
    if (!JWToken) return throwExpressException(401, 'no token sent', next);
    const auth1 = await doesTokenBelongToStudentInGroup(classId.data, JWToken);
    const auth2 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    if (!(auth1.success || !auth2.success)) return throwExpressException(403, auth1.errorMessage, next);

    const classroom = await prisma.class.findFirst({
        where: {id: classId.data}
    });
    if (!classroom) return throwExpressException(404, "classroom not found", next);

    const assignment = await prisma.assignment.findFirst({
        where: {
            id: assignmentId.data,
            class_id: classId.data
        }
    });
    if (!assignment) return throwExpressException(404, "assignment not found", next);

    //not yet done by auth, since auth doesn't check if group is in class and assignment
    const group = await prisma.group.findFirst({
        where: {
            id: groupId.data,
            assignment_id: assignmentId.data
        }
    });
    if (!group) return throwExpressException(404, "group not found", next);

    const learningobject = await prisma.learningObject.findUnique({
        where: {uuid: splitIdToString(learningobjectLink.data)}
    });
    if (!learningobject) return throwExpressException(404, "learningObject not found", next);


    const payload = jwt.verify(JWToken, JWT_SECRET) as JwtPayload;
    if (!payload || typeof payload !== "object" || !payload.id) return throwExpressException(401,"invalid token",next);
    const studentId: number = Number(payload.id);

    let conversation;
    await prisma.$transaction(async (tx) => {
        conversation = await tx.conversation.create({
            data: {
                title: title.data,
                student_id: studentId,
                learning_object_id: learningobject.uuid,
                group_id: groupId.data,
                assignment_id: assignmentId.data
            }
        });
        const teachers = await prisma.teacher.findMany({
            where: {user: {classes: {some: {class_id: classId.data}}}}
        });
        const students = await prisma.student.findMany({
            where: {
                groups: {
                    some: {group_id: groupId.data}
                }
            }
        });
        await prisma.notification.createMany({
            data: teachers.map((teacher) => ({
                read: false,
                user_id: teacher.id,
                type: "QUESTION"
            }))
        });
        await prisma.notification.createMany({
            data: students.map((student) => ({
                read: false,
                user_id: student.id,
                type: "QUESTION"
            }))
        });
    })
    res.status(200).send({
        conversation: conversationLink(classId.data, assignmentId.data, groupId.data, conversation!.id)
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
    if (!JWToken) return throwExpressException(401, 'no token sent', next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    if (!auth1.success) return throwExpressException(auth1.errorCode, auth1.errorMessage, next);

    //class exist check done by auth

    const assignment = await prisma.assignment.findFirst({
        where: {
            id: assignmentId.data,
            class_id: classId.data
        }
    });
    if (!assignment) return throwExpressException(404, "assignment not found", next);

    const group = await prisma.group.findFirst({
        where: {
            id: groupId.data,
            assignment_id: assignmentId.data
        }
    });
    if (!group) return throwExpressException(404, "group not found", next);

    const conversation = await prisma.conversation.findUnique({
        where: {
            id: conversationId.data,
            group_id: groupId.data
        }
    });
    if (!conversation) return throwExpressException(404, "conversation not found", next);

    await prisma.conversation.deleteMany({
        where: {
            id: conversationId.data,
            group_id: groupId.data
        }
    });
    res.status(200).send();
}
