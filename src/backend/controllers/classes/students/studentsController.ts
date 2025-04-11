import {NextFunction, Request, Response} from "express";
import {prisma} from "../../../index.ts";
import {z} from "zod";
import {
    doesTokenBelongToStudentInClass,
    doesTokenBelongToTeacherInClass,
    getJWToken
} from "../../authentication/extraAuthentication.ts";
import {throwExpressException} from "../../../exceptions/ExpressException.ts";
import {studentLink} from "../../../help/links.ts";

export async function getClassStudents(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    if (!classId.success) return throwExpressException(400, "invalid classId", next);

    const JWToken = getJWToken(req, next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    const auth2 = await doesTokenBelongToStudentInClass(classId.data, JWToken);
    if (!(auth1.success || auth2.success))
        return throwExpressException(auth1.errorCode < 300 ? auth2.errorCode : auth1.errorCode, `${auth1.errorMessage} and ${auth2.errorMessage}`, next);

    const students = await prisma.classUser.findMany({
        where: {
            class_id: classId.data,
            user: {teacher: {}}
        }
    });

    const studentLinks = students.map((classStudent) => studentLink(classStudent.user_id));
    res.status(200).send({
        students: studentLinks,
        links: {
            info: req.originalUrl + "/info",
            conversations: req.originalUrl + "/conversations"
        }
    });
}

export async function deleteClassStudent(req: Request, res: Response, next: NextFunction) {
    const studentId = z.coerce.number().safeParse(req.params.studentId);
    const classId = z.coerce.number().safeParse(req.params.classId);

    if (!studentId.success) return throwExpressException(400, "invalid studentId", next);
    if (!classId.success) return throwExpressException(400, "invalid classId", next);

    const JWToken = getJWToken(req, next);
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
