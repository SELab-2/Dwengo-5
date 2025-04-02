import {NextFunction, Request, Response} from "express";
import {prisma} from "../../../../index.ts";
import {z} from "zod";
import {throwExpressException} from "../../../../exceptions/ExpressException.ts";
import {assignmentStudentLink, splitId, studentLink} from "../../../../help/links.ts";
import {zStudentLink} from "../../../../help/validation.ts";
import {
    doesTokenBelongToStudentInAssignment,
    doesTokenBelongToTeacherInClass,
    getJWToken
} from "../../../authentication/extraAuthentication.ts";

export async function getAssignmentStudents(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const assignmentId = z.coerce.number().safeParse(req.params.assignmentId);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!assignmentId.success) return throwExpressException(400, "invalid assignmentId", next);

    const JWToken = getJWToken(req, next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    const auth2 = await doesTokenBelongToStudentInAssignment(assignmentId.data, JWToken);
    if (!(auth1.success || auth2.success))
        return throwExpressException(auth1.errorCode < 300 ? auth2.errorCode : auth1.errorCode, `${auth1.errorMessage} and ${auth2.errorMessage}`, next);

    //class and assignment exist checks done by auth

    const assignment = await prisma.assignment.findUnique({
        where: {id: assignmentId.data},
        include: {
            groups: {
                include: {
                    students_groups: true
                }
            }
        }
    });
    if (!assignment) return throwExpressException(404, "assignment not found", next);

    const learningpathen_links = assignment.groups.flatMap(group =>
        group.students_groups.map(student => studentLink(student.students_id))
    );
    res.status(200).send({students: learningpathen_links});
}

export async function postAssignmentStudent(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const assignmentId = z.coerce.number().safeParse(req.params.assignmentId);
    const studentLink = zStudentLink.safeParse(req.body.student);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!assignmentId.success) return throwExpressException(400, "invalid assignmentId", next);
    if (!studentLink.success) return throwExpressException(400, "invalid studentLink", next);

    const JWToken = getJWToken(req, next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    if (!auth1.success) return throwExpressException(auth1.errorCode, auth1.errorMessage, next);

    //class exist checks done by auth

    const student = await prisma.student.findUnique({
        where: {id: splitId(studentLink.data)}
    });
    if (!student) return throwExpressException(404, "student not found", next);

    const assignment = await prisma.assignment.findUnique({
        where: {id: assignmentId.data}
    });
    if (!assignment) return throwExpressException(404, "assignment not found", next);

    await prisma.group.create({
        data: {
            assignment: assignmentId.data,
            class: classId.data,
            students_groups: {
                create: [{students_id: student.id}]
            }
        }
    });
    res.status(200).send({assignmentStudent: assignmentStudentLink(classId.data, assignmentId.data, splitId(studentLink.data))});
}

export async function deleteAssignmentStudent(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const assignmentId = z.coerce.number().safeParse(req.params.assignmentId);
    const studentId = z.coerce.number().safeParse(req.params.studentId);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!assignmentId.success) return throwExpressException(400, "invalid assignmentId", next);
    if (!studentId.success) return throwExpressException(400, "invalid studentId", next);

    const JWToken = getJWToken(req, next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    if (!auth1.success) return throwExpressException(auth1.errorCode, auth1.errorMessage, next);

    const assignment = prisma.assignment.findUnique({
        where: {id: assignmentId.data},
        include: {
            groups: {
                where: {
                    students_groups: {
                        some: {
                            students_id: studentId.data
                        }
                    }
                }
            }
        }
    });
    if (!assignmentId) return throwExpressException(404, "assignment not found", next);
    if (assignment.groups.length == 0) return throwExpressException(400, "student not in assignment", next);

    await prisma.studentGroup.deleteMany({
        where: {
            students_id: studentId.data,
            groups: {
                assignments: {
                    id: assignmentId.data
                }
            }
        }
    });
    res.status(200).send();
}