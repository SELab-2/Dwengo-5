import {NextFunction, Request, Response} from "express";
import {z} from "zod";
import {throwExpressException} from "../../../../../exceptions/ExpressException.ts";
import {doesTokenBelongToStudentInAssignment, getJWToken} from "../../../../authentication/extraAuthentication.ts";
import {prisma} from "../../../../../index.ts";
import {zLearningobjectLink} from "../../../../../help/validation.ts";
import {$Enums} from "@prisma/client";

export async function postSubmission(req: Request, res: Response, next: NextFunction) {
    const userId = z.coerce.number().safeParse(req.params.userId);
    const classId = z.coerce.number().safeParse(req.params.classId);
    const assignmentId = z.coerce.number().safeParse(req.params.assignmentId);

    console.log("updated")
    const test = z.object({
            learningObject: zLearningobjectLink,
            submissionType: z.literal("plaintext"),
            submission: z.string()
        }).safeParse(req.body);
    if (!test.success) {
        return throwExpressException(400, "test failed", next) 
    }
    else{
        console.log("TEST SUCCESFULL!!")
    }

    const submission = z.union([
        z.object({
            learningObject: zLearningobjectLink,
            submissionType: z.literal("multiplechoice"),
            submission: z.string().regex(/^(\d+\n?)+$/)
        }),
        z.object({
            learningObject: zLearningobjectLink,
            submissionType: z.literal("plaintext"),
            submission: z.string()
        })]).safeParse(req.body);

    if (!userId.success) return throwExpressException(400, "invalid userId", next);
    if (!classId.success) return throwExpressException(400, "Invalid classId", next);
    if (!assignmentId.success) return throwExpressException(400, "Invalid assignmentId", next);
    if (!submission.success) return throwExpressException(400, "Invalid submission body", next);

    const JWToken = getJWToken(req, next);
    if (!JWToken) return throwExpressException(401, 'no token sent', next);
    const auth1 = await doesTokenBelongToStudentInAssignment(assignmentId.data, JWToken);
    if (!auth1.success) return throwExpressException(auth1.errorCode, auth1.errorMessage, next);

    //student exist check done by auth

    const assignment = await prisma.assignment.findUnique({
        where: {
            id: assignmentId.data,
            class_id: classId.data
        }
    });
    if (!assignment) return throwExpressException(404, "assignment not found", next);

    const learningObjects = await prisma.learningObject.findMany({
        where: {
            id: submission.data.learningObject.split("/").at(-1),
            learning_path_nodes: {
                some: {
                    learning_path_id: assignment.learning_path_id
                }
            }
        }
    });
    if (learningObjects.length == 0) return throwExpressException(404, "learningobject not found", next);

    await prisma.$transaction(async (tx) => {
        let groups = await prisma.group.findMany({
            where: {
                assignment_id: assignmentId.data,
                group_students: {
                    some: {
                        student_id: userId.data
                    }
                }
            }
        });
        if (groups.length == 0) return throwExpressException(404, "group not found", next);
        let group = groups[0];
        await tx.submission.create({
            data: {
                assignment_id: assignmentId.data,
                group_id: group.id,
                learning_object_id: learningObjects[0].id,
                submission_type: $Enums.SubmissionType[submission.data.submissionType],
                submission_content: submission.data.submission,
                grade: 0//doesn't have meaning as long as there is no linked grading teacher
            }
        })
    });
    res.status(200).send();
}
