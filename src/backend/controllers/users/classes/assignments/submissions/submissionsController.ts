import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { throwExpressException } from "../../../../../exceptions/ExpressException.ts";
import {
    doesTokenBelongToStudentInAssignment,
    getJWToken,
} from "../../../../authentication/extraAuthentication.ts";
import { prisma } from "../../../../../index.ts";
import { zLearningobjectLink } from "../../../../../help/validation.ts";
import { $Enums } from "@prisma/client";

import {  zUserLink  } from "../../../../../help/validation.ts";
import {  splitId  } from "../../../../../help/links.ts";

import {
    doesTokenBelongToTeacher,
    doesTokenBelongToTeacherInClass,
} from "../../../../authentication/extraAuthentication.ts";

export async function postSubmissionAutoGrade(req: Request, res: Response, next: NextFunction) {
    const userId = z.coerce.number().safeParse(req.params.userId);
    const classId = z.coerce.number().safeParse(req.params.classId);
    const assignmentId = z.coerce.number().safeParse(req.params.assignmentId);
    const grade = z.coerce.number().safeParse(req.body.grade);

    const submission = z.union([
        z.object({
            learningObject: zLearningobjectLink,
            submissionType: z.literal("multiplechoice"),
            submission: z.string()
        }),
        z.object({
            learningObject: zLearningobjectLink,
            submissionType: z.literal("plaintext"),
            submission: z.string()
        })]).safeParse(req.body);

    if (!userId.success)
        return throwExpressException(400, "invalid userId", next);
    if (!classId.success)
        return throwExpressException(400, "Invalid classId", next);
    if (!assignmentId.success)
        return throwExpressException(400, "Invalid assignmentId", next);
    if (!submission.success)
        return throwExpressException(400, "Invalid submission body", next);
    if (!grade.success)
        return throwExpressException(400, "Invalid gradeId", next);

    const JWToken = getJWToken(req);
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
                grade: grade.data//doesn't have meaning as long as there is no linked grading teacher
            }
        })
    });
    res.status(200).send();
}

export async function getSubmissions(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const userId = z.coerce.number().safeParse(req.params.userId);
    const classId = z.coerce.number().safeParse(req.params.classId);
    const assignmentId = z.coerce.number().safeParse(req.params.assignmentId);
    const grade = z.coerce.number().safeParse(req.body.grade);

    const submission = z.union([
        z.object({
            learningObject: zLearningobjectLink,
            submissionType: z.literal("multiplechoice"),
            submission: z.string()
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
    if (!grade.success) return throwExpressException(400, "Invalid gradeId", next);

    const JWToken = getJWToken(req);
    if (!JWToken) return throwExpressException(401, "no token sent", next);
    const auth1 = await doesTokenBelongToStudentInAssignment(
        assignmentId.data,
        JWToken
    );
    if (!auth1.success)
        return throwExpressException(auth1.errorCode, auth1.errorMessage, next);

    //student exist check done by auth

    const assignment = await prisma.assignment.findUnique({
        where: {
            id: assignmentId.data,
            class_id: classId.data,
        },
    });
    if (!assignment)
        return throwExpressException(404, "assignment not found", next);

    const learningObjects = await prisma.learningObject.findMany({
        where: {
            id: submission.data.learningObject.split("/").at(-1),
            learning_path_nodes: {
                some: {
                    learning_path_id: assignment.learning_path_id,
                },
            },
        },
    });
    if (learningObjects.length == 0)
        return throwExpressException(404, "learningobject not found", next);

    await prisma.$transaction(async (tx) => {
        let groups = await prisma.group.findMany({
            where: {
                assignment_id: assignmentId.data,
                group_students: {
                    some: {
                        student_id: userId.data,
                    },
                },
            },
        });
        if (groups.length == 0)
            return throwExpressException(404, "group not found", next);
        let group = groups[0];
        await tx.submission.create({
            data: {
                assignment_id: assignmentId.data,
                group_id: group.id,
                learning_object_id: learningObjects[0].id,
                submission_type:
                    $Enums.SubmissionType[submission.data.submissionType],
                submission_content: submission.data.submission,
                grade: grade.data, //doesn't have meaning as long as there is no linked grading teacher
            },
        });
    });
    res.status(200).send();
}

export async function postSubmission(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const userId = z.coerce.number().safeParse(req.params.userId);
    const classId = z.coerce.number().safeParse(req.params.classId);
    const assignmentId = z.coerce.number().safeParse(req.params.assignmentId);

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

    if (!userId.success)
        return throwExpressException(400, "invalid userId", next);
    if (!classId.success)
        return throwExpressException(400, "Invalid classId", next);
    if (!assignmentId.success)
        return throwExpressException(400, "Invalid assignmentId", next);
    if (!submission.success)
        return throwExpressException(400, "Invalid submission body", next);

    const JWToken = getJWToken(req);
    if (!JWToken) return throwExpressException(401, "no token sent", next);
    const auth1 = await doesTokenBelongToStudentInAssignment(
        assignmentId.data,
        JWToken
    );
    if (!auth1.success)
        return throwExpressException(auth1.errorCode, auth1.errorMessage, next);

    //student exist check done by auth

    const assignment = await prisma.assignment.findUnique({
        where: {
            id: assignmentId.data,
            class_id: classId.data,
        },
    });
    if (!assignment)
        return throwExpressException(404, "assignment not found", next);

    const learningObjects = await prisma.learningObject.findMany({
        where: {
            id: submission.data.learningObject.split("/").at(-1),
            learning_path_nodes: {
                some: {
                    learning_path_id: assignment.learning_path_id,
                },
            },
        },
    });
    if (learningObjects.length == 0)
        return throwExpressException(404, "learningobject not found", next);

    await prisma.$transaction(async (tx) => {
        let groups = await prisma.group.findMany({
            where: {
                assignment_id: assignmentId.data,
                group_students: {
                    some: {
                        student_id: userId.data,
                    },
                },
            },
        });
        if (groups.length == 0)
            return throwExpressException(404, "group not found", next);
        let group = groups[0];
        await tx.submission.create({
            data: {
                assignment_id: assignmentId.data,
                group_id: group.id,
                learning_object_id: learningObjects[0].id,
                submission_type:
                    $Enums.SubmissionType[submission.data.submissionType],
                submission_content: submission.data.submission,
                grade: 0, //doesn't have meaning as long as there is no linked grading teacher
            },
        });
    });
    res.status(200).send();
}

export async function getSubmissions(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const userId = z.coerce.number().safeParse(req.params.userId);
    const classId = z.coerce.number().safeParse(req.params.classId);
    const assignmentId = z.coerce.number().safeParse(req.params.assignmentId);
    const groupId = z.coerce.number().safeParse(req.params.groupId);

    if (!userId.success)
        return throwExpressException(400, "invalid userId", next);
    if (!classId.success)
        return throwExpressException(400, "Invalid classId", next);
    if (!assignmentId.success)
        return throwExpressException(400, "Invalid assignmentId", next);
    if (!groupId.success)
        return throwExpressException(400, "Invalid groupId", next);

    const JWToken = getJWToken(req);
    if (!JWToken) return throwExpressException(401, "no token sent", next);
    //const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    //if (!auth1.success) return throwExpressException(auth1.errorCode, auth1.errorMessage, next);

    //student exist check done by auth

    const group = await prisma.group.findUnique({
        where: {
            id: groupId.data,
            assignment: {
                id: assignmentId.data,
                class_id: classId.data,
            },
        },
    });
    if (!group) return throwExpressException(404, "group not found", next);

    const submissions = await prisma.submission.findMany({
        where: {
            group_id: groupId.data,
            assignment_id: assignmentId.data,
        },
    });
    res.status(200).send({  submissions: submissions  });
}

export async function getSubmission(
    req: Request,
    res: Response,
    next: NextFunction
)  {
    const userId = z.coerce.number().safeParse(req.params.userId);
    const classId = z.coerce.number().safeParse(req.params.classId);
    const assignmentId = z.coerce.number().safeParse(req.params.assignmentId);
    const groupId = z.coerce.number().safeParse(req.params.groupId);
    const submissionId = z.coerce.number().safeParse(req.params.submissionId);

    if (!userId.success)
        return throwExpressException(400, "invalid userId", next);
    if (!classId.success)
        return throwExpressException(400, "Invalid classId", next);
    if (!assignmentId.success)
        return throwExpressException(400, "Invalid assignmentId", next);
    if (!groupId.success)
        return throwExpressException(400, "Invalid groupId", next);
    if (!submissionId.success)
        return throwExpressException(400, "Invalid submissionId", next);

    const JWToken = getJWToken(req);
    if (!JWToken) return throwExpressException(401, "no token sent", next);

    const submission = await prisma.submission.findMany({
        where: {
            id: submissionId.data,
        },
    });
    res.status(200).send({  submissions: submission  });
}


export async function gradeAutomaticSubmission(req: Request, res: Response, next: NextFunction) {
    const userId = z.coerce.number().safeParse(req.params.userId);
    const classId = z.coerce.number().safeParse(req.params.classId);
    const assignmentId = z.coerce.number().safeParse(req.params.assignmentId);
    const submissionId = z.coerce.number().safeParse(req.params.submissionId);
    const grade = z
        .object({
            teacher: zUserLink,
            grade: z.coerce.number(),
        })
        .safeParse(req.body);

    if (!userId.success) return throwExpressException(400, "invalid userId", next);
    if (!classId.success) return throwExpressException(400, "Invalid classId", next);
    if (!assignmentId.success) return throwExpressException(400, "Invalid assignmentId", next);
    if (!submissionId.success) return throwExpressException(400, "Invalid submissionId", next);
    if (!grade.success) return throwExpressException(400, "Invalid gradeId", next);

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
        }
    });

    res.status(200).send();
}




export async function gradeAutomaticSubmission(req: Request, res: Response, next: NextFunction) {
    const userId = z.coerce.number().safeParse(req.params.userId);
    const classId = z.coerce.number().safeParse(req.params.classId);
    const assignmentId = z.coerce.number().safeParse(req.params.assignmentId);
    const submissionId = z.coerce.number().safeParse(req.params.submissionId);
    const grade = z.object({
        grade: z.coerce.number()
    }).safeParse(req.body);

    if (!userId.success) return throwExpressException(400, "invalid userId", next);
    if (!classId.success) return throwExpressException(400, "Invalid classId", next);
    if (!assignmentId.success) return throwExpressException(400, "Invalid assignmentId", next);
    if (!submissionId.success) return throwExpressException(400, "Invalid submissionId", next);
    if (!grade.success) return throwExpressException(400, "Invalid gradeId", next);

    const submission = await prisma.submission.findUnique({
        where: {
            id: submissionId.data,
            assignment: {
                id: assignmentId.data,
                class_id: classId.data,
            },
        },
    });
    if (!submission) return throwExpressException(404, "submission not found", next);

    await prisma.submission.update({
        where: {
            id: submissionId.data,
        },
        data: {
            grade: grade.data.grade,
        }
    });

    res.status(200).send();
}



export async function gradeSubmission(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const userId = z.coerce.number().safeParse(req.params.userId);
    const classId = z.coerce.number().safeParse(req.params.classId);
    const assignmentId = z.coerce.number().safeParse(req.params.assignmentId);
    const groupId = z.coerce.number().safeParse(req.params.groupId);
    const submissionId = z.coerce.number().safeParse(req.params.submissionId);
    const grade = z.object({
        teacher: zUserLink, 
        grade: z.coerce.number()
    }).safeParse(req.body);

    if (!userId.success)
        return throwExpressException(400, "invalid userId", next);
    if (!classId.success)
        return throwExpressException(400, "Invalid classId", next);
    if (!assignmentId.success)
        return throwExpressException(400, "Invalid assignmentId", next);
    if (!groupId.success)
        return throwExpressException(400, "Invalid groupId", next);
    if (!submissionId.success)
        return throwExpressException(400, "Invalid submissionId", next);
    if (!grade.success)
        return throwExpressException(400, "Invalid gradeId", next);

    const JWToken = getJWToken(req);
    if (!JWToken) return throwExpressException(401, "no token sent", next);

    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    const auth2 = await doesTokenBelongToTeacher(
        splitId(grade.data.teacher),
        JWToken
    );
    if (!(auth1.success && auth2.success))
        return throwExpressException(
            (auth1.errorCode > 300 ? auth1 : auth2).errorCode,
            `${auth1.errorMessage} and ${auth2.errorMessage}`,
            next
        );

    //student exist check done by auth

    const group = await prisma.group.findUnique({
        where: {
            id: groupId.data,
            assignment: {
                id: assignmentId.data,
                class_id: classId.data,
            },
        },
    });
    if (!group) return throwExpressException(404, "group not found", next);

    const submission = await prisma.submission.findUnique({
        where: {
            id: submissionId.data,
            assignment: {
                id: assignmentId.data,
                class_id: classId.data,
            },
        },
    });
    if (!submission) return throwExpressException(404, "submission not found", next);

    await prisma.submission.update({
        where: {
            id: submissionId.data,
        },
        data: {
            grade: grade.data.grade,
            graded_by: splitId(grade.data.teacher),
        },
    });

    res.status(200).send();
}
