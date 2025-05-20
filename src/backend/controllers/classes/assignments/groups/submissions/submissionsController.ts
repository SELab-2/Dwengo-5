import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { throwExpressException } from "../../../../../exceptions/ExpressException.ts";
import {
    doesTokenBelongToTeacher,
    doesTokenBelongToTeacherInClass,
    getJWToken
} from "../../../../authentication/extraAuthentication.ts";
import { prisma } from "../../../../../index.ts";
import { zUserLink } from "../../../../../help/validation.ts";
import { splitId } from "../../../../../help/links.ts";

export async function getSubmissions(req: Request, res: Response, next: NextFunction) {
    const userId = z.coerce.number().safeParse(req.params.userId);
    const classId = z.coerce.number().safeParse(req.params.classId);
    const assignmentId = z.coerce.number().safeParse(req.params.assignmentId);
    const groupId = z.coerce.number().safeParse(req.params.groupId);

    if (!userId.success) return throwExpressException(400, "invalid userId", next);
    if (!classId.success) return throwExpressException(400, "Invalid classId", next);
    if (!assignmentId.success) return throwExpressException(400, "Invalid assignmentId", next);
    if (!groupId.success) return throwExpressException(400, "Invalid groupId", next);

    const JWToken = getJWToken(req, next);
    if (!JWToken) return throwExpressException(401, 'no token sent', next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    if (!auth1.success) return throwExpressException(auth1.errorCode, auth1.errorMessage, next);

    //student exist check done by auth

    const group = await prisma.group.findUnique({
        where: {
            id: groupId.data,
            assignment: {
                id: assignmentId.data,
                class_id: classId.data
            }
        }
    });
    if (!group) return throwExpressException(404, "group not found", next);

    const submissions = await prisma.submission.findMany({
        where: {
            group_id: groupId.data,
            assignment_id: assignmentId.data
        }
    });
    res.status(200).send({ "submissions": submissions });
}

export async function gradeSubmission(req: Request, res: Response, next: NextFunction) {
    const userId = z.coerce.number().safeParse(req.params.userId);
    const classId = z.coerce.number().safeParse(req.params.classId);
    const assignmentId = z.coerce.number().safeParse(req.params.assignmentId);
    const groupId = z.coerce.number().safeParse(req.params.groupId);
    const submissionId = z.coerce.number().safeParse(req.params.submissionId);
    const grade = z.object({ teacher: zUserLink, grade: z.number() }).safeParse(req.body);

    if (!userId.success) return throwExpressException(400, "invalid userId", next);
    if (!classId.success) return throwExpressException(400, "Invalid classId", next);
    if (!assignmentId.success) return throwExpressException(400, "Invalid assignmentId", next);
    if (!groupId.success) return throwExpressException(400, "Invalid groupId", next);
    if (!submissionId.success) return throwExpressException(400, "Invalid submissionId", next);
    if (!grade.success) return throwExpressException(400, "Invalid gradeId", next);

    const JWToken = getJWToken(req, next);
    if (!JWToken) return throwExpressException(401, 'no token sent', next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    const auth2 = await doesTokenBelongToTeacher(splitId(grade.data.teacher), JWToken);
    if (!(auth1.success && auth2.success))
        return throwExpressException((auth1.errorCode > 300 ? auth1 : auth2).errorCode, `${auth1.errorMessage} and ${auth2.errorMessage}`, next);

    //student exist check done by auth

    const group = await prisma.group.findUnique({
        where: {
            id: groupId.data,
            assignment: {
                id: assignmentId.data,
                class_id: classId.data
            }
        }
    });
    if (!group) return throwExpressException(404, "group not found", next);

    const submission = await prisma.submission.findUnique({
        where: {
            id: submissionId.data,
            assignment: {
                id: assignmentId.data,
                class_id: classId.data
            }
        }
    });

    await prisma.submission.update({
        where: {
            id: submissionId.data
        },
        data: {
            grade: grade.data.grade,
            graded_by: splitId(grade.data.teacher)
        }
    });

    res.status(200).send();
}
