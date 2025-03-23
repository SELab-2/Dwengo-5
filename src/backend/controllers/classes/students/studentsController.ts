import {NextFunction, Request, Response} from "express";
import {prisma} from "../../../index.ts";
import {z} from "zod";
import {
    doesTokenBelongToStudentInClass,
    doesTokenBelongToTeacherInClass,
    getJWToken,
} from "../../authentication/extraAuthentication.ts";
import {throwExpressException} from "../../../exceptions/ExpressException.ts";
import {studentLink} from "../../../help/links.ts";
import {zStudentLink} from "../../../help/validation.ts";

export async function getClassStudents(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    if (!classId.success) return throwExpressException(400, "invalid classId", next);

    const JWToken = getJWToken(req, next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    const auth2 = await doesTokenBelongToStudentInClass(classId.data, JWToken);
    if (!(auth1.success || auth2.success))
        return throwExpressException(403, auth1.errorMessage + " and " + auth2.errorMessage, next);

    const students = await prisma.classStudent.findMany({
        where: {classes_id: classId.data}
    });
    const studentLinks = students.map((classStudent) => studentLink(classStudent.students_id));
    res.status(200).send({students: studentLinks});
}

// todo: hoe werken met wachtrij
export async function postClassStudent(req: Request, res: Response, next: NextFunction) {
    //todo: auth (ik weet niet wat hier de auth moet zijn)

    const studentLink = zStudentLink.safeParse(req.body.student);
    if (!studentLink.success) return throwExpressException(400, "invalid student", next);

    const classId = z.coerce.number().safeParse(req.params.classId);
    if (!classId.success) return throwExpressException(400, "invalid classId", next);

    const studentId: number = Number(studentLink.data.split("/").pop());

    //class en student exist checks already done by auth

    await prisma.classStudent.create({
        data: {
            classes_id: classId.data,
            students_id: studentId,
            accepted: false,
        },
    });
    res.status(200).send();
}

export async function patchClassStudent(req: Request, res: Response, next: NextFunction) {
    const studentLink = zStudentLink.safeParse(req.body.student);
    if (!studentLink.success) return throwExpressException(400, "invalid student", next);

    const classId = z.coerce.number().safeParse(req.params.classId);
    if (!classId.success) return throwExpressException(400, "invalid classId", next);

    const studentId = Number(studentLink.data.split("/").pop());

    await prisma.classStudent.update({
        where: {
            classes_id_students_id: {
                classes_id: classId.data,
                students_id: studentId,
            }
        },
        data: {
            accepted: true
        }
    })
}


export async function deleteClassStudent(req: Request, res: Response, next: NextFunction) {
    const studentId = z.coerce.number().safeParse(req.params.studentId);
    const classId = z.coerce.number().safeParse(req.params.classId);

    if (!studentId.success) return throwExpressException(400, "invalid studentId", next);
    if (!classId.success) return throwExpressException(400, "invalid classId", next);

    const JWToken = getJWToken(req, next);
    const auth = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    if (!auth.success) return throwExpressException(403, auth.errorMessage, next);

    //class exist check done by auth

    const student = await prisma.classStudent.findUnique({
        where: {
            classes_id_students_id: {
                classes_id: classId.data,
                students_id: studentId.data,
            }
        },
    });
    if (!student) return throwExpressException(404, "student not found", next);

    await prisma.classStudent.deleteMany({
        where: {
            classes_id: classId.data,
            students_id: studentId.data
        }
    });
    res.status(200).send();
}
