import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../../../../../index.ts";
import { throwExpressException } from "../../../../../exceptions/ExpressException.ts";
import { groupLink } from "../../../../../help/links.ts";
import { doesTokenBelongToStudent, getJWToken } from "../../../../authentication/extraAuthentication.ts";

export async function getStudentAssignmentGroup(req: Request, res: Response, next: NextFunction) {
    const userId = z.coerce.number().safeParse(req.params.userId);
    const classId = z.coerce.number().safeParse(req.params.classId);
    const assignmentId = z.coerce.number().safeParse(req.params.assignmentId);

    if (!userId.success) return throwExpressException(400, "invalid userId", next);
    if (!classId.success) return throwExpressException(400, "Invalid classId", next);
    if (!assignmentId.success) return throwExpressException(400, "Invalid assignmentId", next);

    const JWToken = getJWToken(req, next);
    if (!JWToken) return throwExpressException(401, 'no token sent', next);
    const auth1 = await doesTokenBelongToStudent(userId.data, JWToken);
    if (!auth1.success) return throwExpressException(auth1.errorCode, auth1.errorMessage, next);

    //student exist check done by auth

    const assignment = await prisma.assignment.findUnique({
        where: {
            id: assignmentId.data,
            class_id: classId.data
        }
    });
    if (!assignment) return throwExpressException(404, "assignment not found", next);

    const groups = await prisma.group.findMany({
        where: {
            assignment: {
                class_id: classId.data,
                id: assignmentId.data
            },
            group_students: { some: { student_id: userId.data } },
        }
    });
    if (groups.length == 0) return throwExpressException(404, "user not in assignment", next);
    res.status(200).send({ group: groupLink(classId.data, assignmentId.data, groups[0].id) });
}