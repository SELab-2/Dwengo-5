import {NextFunction, Request, Response} from "express";
import {prisma} from "../../../index.ts";
import {z} from "zod";
import {
    doesTokenBelongToStudentInClass,
    doesTokenBelongToTeacherInClass,
    getJWToken
} from "../../authentication/extraAuthentication.ts";
import {throwExpressException} from "../../../exceptions/ExpressException.ts";
import {classStudentLink, groupLink, userLink} from "../../../help/links.ts";

export async function getClassStudents(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    if (!classId.success) return throwExpressException(400, "invalid classId", next);

    const JWToken = getJWToken(req, next);
    if (!JWToken) return throwExpressException(401, 'no token sent', next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    const auth2 = await doesTokenBelongToStudentInClass(classId.data, JWToken);
    if (!(auth1.success || auth2.success))
        return throwExpressException(auth1.errorCode < 300 ? auth2.errorCode : auth1.errorCode, `${auth1.errorMessage} and ${auth2.errorMessage}`, next);

    const students = await prisma.classUser.findMany({
        where: {
            class_id: classId.data,
            user: {student: {some: {}}}
        }
    });

    const classStudentLinks = students.map((classStudent) => classStudentLink(classId.data, classStudent.user_id));
    res.status(200).send({
        classStudents: classStudentLinks,
        links: {
            info: req.originalUrl + "/info",
            conversations: req.originalUrl + "/conversations"
        }
    });
}

export async function getClassStudent(req: Request, res: Response, next: NextFunction) {
    const studentId = z.coerce.number().safeParse(req.params.studentId);
    const classId = z.coerce.number().safeParse(req.params.classId);

    if (!studentId.success) return throwExpressException(400, "invalid studentId", next);
    if (!classId.success) return throwExpressException(400, "invalid classId", next);

    const JWToken = getJWToken(req, next);
    if (!JWToken) return throwExpressException(401, 'no token sent', next);

    const classUser = await prisma.classUser.findUnique({
        where: {
            class_id_user_id: {
                class_id: classId.data,
                user_id: studentId.data
            }
        },
        include: {
            user: {
                include: {
                    student: {
                        include: {
                            groups: {
                                include: {
                                    group: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    if (!classUser || !classUser.user || !classUser.user.student || !classUser.user.student.length) return throwExpressException(404, "student not found", next);

    res.status(200).send({
        student: userLink(studentId.data),
        groups: classUser.user.student[0].groups.map((studentGroup) => groupLink(classId.data, studentGroup.group.assignment_id, studentGroup.group_id)),
        links: {
            info: req.originalUrl + "/info",
            conversations: req.originalUrl + "/conversations"
        }
    });
}

export async function patchClassStudent(req: Request, res: Response, next: NextFunction) {
    const studentId = z.coerce.number().safeParse(req.params.studentId);
    const classId = z.coerce.number().safeParse(req.params.classId);

    if (!studentId.success) return throwExpressException(400, "invalid studentId", next);
    if (!classId.success) return throwExpressException(400, "invalid classId", next);

    const JWToken = getJWToken(req, next);
    if (!JWToken) return throwExpressException(401, 'no token sent', next);
    const auth = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    if (!auth.success) return throwExpressException(403, auth.errorMessage, next);

    //class and student exist check done by auth
}

export async function deleteClassStudent(req: Request, res: Response, next: NextFunction) {
    const studentId = z.coerce.number().safeParse(req.params.studentId);
    const classId = z.coerce.number().safeParse(req.params.classId);

    if (!studentId.success) return throwExpressException(400, "invalid studentId", next);
    if (!classId.success) return throwExpressException(400, "invalid classId", next);

    const JWToken = getJWToken(req, next);
    if (!JWToken) return throwExpressException(401, 'no token sent', next);
    const auth = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    if (!auth.success) return throwExpressException(403, auth.errorMessage, next);

    //class and student exist check done by auth

    await prisma.classUser.deleteMany({
        where: {
            class_id: classId.data,
            user_id: studentId.data
        }
    });
    res.status(200).send();
}
