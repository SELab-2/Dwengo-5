import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../../../../index.ts";
import { throwExpressException } from "../../../../exceptions/ExpressException.ts";
import { assignmentLink } from "../../../../help/links.ts";
import {
    doesTokenBelongToStudent,
    getJWToken,
} from "../../../authentication/extraAuthentication.ts";

export async function getStudentAssignments(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const userId = z.coerce.number().safeParse(req.params.userId);
    const classId = z.coerce.number().safeParse(req.params.classId);

    if (!userId.success)
        return throwExpressException(400, "invalid userId", next);
    if (!classId.success)
        return throwExpressException(400, "Invalid classId", next);

    const JWToken = getJWToken(req);
    if (!JWToken) return throwExpressException(401, "no token sent", next);
    const auth1 = await doesTokenBelongToStudent(userId.data, JWToken);
    if (!auth1.success)
        return throwExpressException(auth1.errorCode, auth1.errorMessage, next);

    //student exist check done by auth

    const classroom = await prisma.class.findUnique({
        where: { id: classId.data },
    });
    if (!classroom) return throwExpressException(404, "class not found", next);

    const assignments = await prisma.assignment.findMany({
        where: {
            class_id: classId.data,
            groups: {
                some: { group_students: { some: { student_id: userId.data } } },
            },
        },
    });
    const assignmentLinks = assignments.map((assignment) =>
        assignmentLink(classId.data, assignment.id)
    );
    res.status(200).send({ assignments: assignmentLinks });
}
