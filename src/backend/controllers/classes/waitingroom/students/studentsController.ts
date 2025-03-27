import {NextFunction, Request, Response} from "express";
import {z} from "zod";
import {throwExpressException} from "../../../../exceptions/ExpressException.ts";
import {
    doesTokenBelongToStudent,
    doesTokenBelongToTeacherInClass,
    getJWToken
} from "../../../authentication/extraAuthentication.ts";
import {prisma} from "../../../../index.ts";
import {splitId, studentLink} from "../../../../help/links.ts";
import {zStudentLink} from "../../../../help/validation.ts";

export async function getWaitingroomStudents(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.class);
    if (!classId.success) return throwExpressException(400, "invalid classId", next);

    const JWToken = getJWToken(req, next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    if (auth1.success) return throwExpressException(403, auth1.errorMessage, next);

    const students = await prisma.waitingroom_student.findMany({
        where: {class_id: classId.data}
    })

    const studentLinks = students.map(student => studentLink(student.id));
    return res.status(200).send({students: studentLinks});
}

export async function postWaitingroomStudent(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.class);
    const studentLink = zStudentLink.safeParse(req.body.student);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!studentLink.success) return throwExpressException(400, "invalid studentLink", next);

    const JWToken = getJWToken(req, next);
    const auth1 = await doesTokenBelongToStudent(classId.data, JWToken);
    if (auth1.success) return throwExpressException(403, auth1.errorMessage, next);

    await prisma.waitingroom_student.create({
        where: {
            class_id: classId.data,
            student_id = splitId(studentLink.data)
        }
    })
    return res.status(200).send();
}

export async function patchWaitingroomStudent(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.class);
    const studentLink = zStudentLink.safeParse(req.body.student);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!studentLink.success) return throwExpressException(400, "invalid studentLink", next);

    const JWToken = getJWToken(req, next);
    const auth1 = await doesTokenBelongToStudent(classId.data, JWToken);
    if (auth1.success) return throwExpressException(403, auth1.errorMessage, next);

    await prisma.$transaction([
        prisma.waitingroom_student.deleteMany({
            where: {
                class_id: classId.data,
                student_id = splitId(studentLink.data)
            }
        }),
        prisma.classStudent.create({
            data: {
                classes_id: classId.data,
                students_id: splitId(studentLink.data)
            }
        })

    ])
    return res.status(200).send();
}

export async function deleteWaitingroomStudent(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.class);
    const studentLink = zStudentLink.safeParse(req.body.student);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!studentLink.success) return throwExpressException(400, "invalid studentLink", next);

    const JWToken = getJWToken(req, next);
    const auth1 = await doesTokenBelongToStudent(classId.data, JWToken);
    if (auth1.success) return throwExpressException(403, auth1.errorMessage, next);

    await prisma.waitingroom_student.deleteMany({
        where: {
            class_id: classId.data,
            student_id : splitId(studentLink.data)
        }
    })
    return res.status(200).send();
}