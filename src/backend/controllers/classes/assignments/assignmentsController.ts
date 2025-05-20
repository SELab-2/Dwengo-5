import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../index.ts";
import { throwExpressException } from "../../../exceptions/ExpressException.ts";
import { z } from "zod";
import { assignmentLink, learningpathLink, splitIdToString } from "../../../help/links.ts";
import { zLearningpathLink } from "../../../help/validation.ts";
import {
    doesTokenBelongToStudentInAssignment,
    doesTokenBelongToStudentInClass,
    doesTokenBelongToTeacherInClass,
    getJWToken
} from "../../authentication/extraAuthentication.ts";

export async function getClassAssignment(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const assignmentId = z.coerce.number().safeParse(req.params.assignmentId);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!assignmentId.success) return throwExpressException(400, "invalid assignmentId", next);

    const JWToken = getJWToken(req, next);
    if (!JWToken) return throwExpressException(401, 'no token sent', next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    const auth2 = await doesTokenBelongToStudentInAssignment(assignmentId.data, JWToken);
    if (!(auth1.success || auth2.success))
        return throwExpressException(auth1.errorCode < 300 ? auth2.errorCode : auth1.errorCode, `${auth1.errorMessage} and ${auth2.errorMessage}`, next);

    //class exist check done by auth

    const assignment = await prisma.assignment.findUnique({
        where: {
            id: assignmentId.data,
            class_id: classId.data
        }
    });
    if (!assignment) return throwExpressException(404, "assignment not found", next);
    res.status(200).send({
        deadline: assignment.deadline,
        learningpath: learningpathLink(assignment.learning_path_id),
        name: assignment.name,
        links: {
            conversations: req.originalUrl + "/conversations",
            groups: req.originalUrl + "/groups",
            students: req.originalUrl + "/users"
        }
    });
}

export async function getClassAssignments(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    if (!classId.success) return throwExpressException(400, "invalid classId", next);

    const JWToken = getJWToken(req, next);
    if (!JWToken) return throwExpressException(401, 'no token sent', next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    const auth2 = await doesTokenBelongToStudentInClass(classId.data, JWToken);
    if (!(auth1.success || auth2.success))
        return throwExpressException(auth1.errorCode < 300 ? auth2.errorCode : auth1.errorCode, `${auth1.errorMessage} and ${auth2.errorMessage}`, next);

    //class exist check done by auth

    const assignments = await prisma.assignment.findMany({
        where: { class_id: classId.data }
    });
    const assignmentLinks = assignments.map(assignment => assignmentLink(classId.data, assignment.id));
    res.status(200).send({ assignments: assignmentLinks });
}

export async function postClassAssignment(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const learningpathLink = zLearningpathLink.safeParse(req.body.learningpath);
    const deadline = z.coerce.date().safeParse(req.body.deadline);
    const name = z.coerce.string().safeParse(req.body.name);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!learningpathLink.success) return throwExpressException(400, "invalid learningpathLink", next);
    if (!deadline.success) return throwExpressException(400, "invalid deadline", next);
    if (!name.success) return throwExpressException(400, "invalid name", next);

    const JWToken = getJWToken(req, next);
    if (!JWToken) return throwExpressException(401, 'no token sent', next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    if (!auth1.success) return throwExpressException(auth1.errorCode, auth1.errorMessage, next);

    //class exist check cone by auth

    const learningpath = await prisma.learningPath.findUnique({
        where: { id: splitIdToString(learningpathLink.data) }
    });
    if (!learningpath) return throwExpressException(404, "learningpath not found", next);

    const assignment = await prisma.assignment.create({
        data: {
            deadline: deadline.data,
            name: name.data,
            created_at: new Date(),
            class_id: classId.data,
            learning_path_id: splitIdToString(learningpathLink.data)!
        }
    });
    res.status(200).send({ assignment: assignmentLink(classId.data, assignment.id) });
}

export async function deleteClassAssignment(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const assignmentId = z.coerce.number().safeParse(req.params.assignmentId);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!assignmentId.success) return throwExpressException(400, "invalid assignmentId", next);

    const JWToken = getJWToken(req, next);
    if (!JWToken) return throwExpressException(401, 'no token sent', next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    if (!auth1.success) return throwExpressException(auth1.errorCode, auth1.errorMessage, next);

    //class exist check done by auth

    const assignment = await prisma.assignment.findUnique({
        where: {
            id: assignmentId.data,
            class_id: classId.data
        }
    });
    if (!assignment) return throwExpressException(404, "assignment not found", next);

    await prisma.assignment.deleteMany({
        where: { id: assignmentId.data }
    });
    res.status(200).send();
}
