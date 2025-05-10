import {NextFunction, Request, Response} from "express";
import {prisma} from "../../../../index.ts";
import {z} from "zod";
import {throwExpressException} from "../../../../exceptions/ExpressException.ts";
import {
    doesTokenBelongToStudentInAssignment,
    doesTokenBelongToTeacherInClass,
    getJWToken
} from "../../../authentication/extraAuthentication.ts";
import {userLink} from "../../../../help/links.ts";

export async function getAssignmentStudents(req: Request, res: Response, next: NextFunction) {
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

    //class and assignment exist checks done by auth

    const assignment = await prisma.assignment.findUnique({
        where: {id: assignmentId.data},
        include: {
            groups: {
                include: {
                    group_students: true
                }
            }
        }
    });
    if (!assignment) return throwExpressException(404, "assignment not found", next);

    const studentLinks = assignment.groups.flatMap(group =>
        group.group_students.map(student => userLink(student.student_id))
    );
    res.status(200).send({students: studentLinks});
}

export async function deleteAssignmentStudent(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const assignmentId = z.coerce.number().safeParse(req.params.assignmentId);
    const studentId = z.coerce.number().safeParse(req.params.studentId);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!assignmentId.success) return throwExpressException(400, "invalid assignmentId", next);
    if (!studentId.success) return throwExpressException(400, "invalid studentId", next);

    const JWToken = getJWToken(req, next);
    if (!JWToken) return throwExpressException(401, 'no token sent', next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    if (!auth1.success) return throwExpressException(auth1.errorCode, auth1.errorMessage, next);

    const assignment = prisma.assignment.findUnique({
        where: {
            id: assignmentId.data,
            class_id: classId.data
        },
        include: {
            groups: {
                where: {
                    group_students: {
                        some: {
                            student_id: studentId.data
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
            student_id: studentId.data,
            group: {
                assignment: {
                    id: assignmentId.data
                }
            }
        }
    });
    res.status(200).send();
}