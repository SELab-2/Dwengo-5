import {NextFunction, Request, Response} from "express";
import {z} from "zod";
import {throwExpressException} from "../../exceptions/ExpressException.ts";
import {
    doesTokenBelongToStudent,
    doesTokenBelongToTeacher,
    doesTokenBelongToTeacherInClass,
    getJWToken
} from "../authentication/extraAuthentication.ts";
import {prisma} from "../../index.ts";
import {splitId, studentLink, waitingroomStudentLink, waitingroomTeacherLink} from "../../help/links.ts";
import {zStudentLink, zTeacherLink} from "../../help/validation.ts";

function isStudent(userType: "student" | "teacher") {
    return userType == "student";
}

export function getWaitingroomUserUnion(userType: "student" | "teacher") {
    return async function (req: Request, res: Response, next: NextFunction) {
        const classId = z.coerce.number().safeParse(req.params.classId);
        if (!classId.success) return throwExpressException(400, "invalid classId", next);

        const JWToken = getJWToken(req, next);
    if (!JWToken) return throwExpressException(401, 'no token sent', next);
        const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
        if (!auth1.success) return throwExpressException(auth1.errorCode, auth1.errorMessage, next);

        const waitingroomUserTable = isStudent(userType) ? prisma.waitingroomStudent : prisma.waitingroomTeacher;

        // @ts-ignore
        const users = await waitingroomUserTable.findMany({
            where: {classes_id: classId.data}
        })

        // @ts-ignore
        const userLinks = users.map(user => studentLink(user[`${userType}s_id`]));
        res.status(200).send({[`${userType}s`]: userLinks});
    }
}

export function postWaitingroomUserUnion(userType: "student" | "teacher") {
    return async function (req: Request, res: Response, next: NextFunction) {
        const classId = z.coerce.number().safeParse(req.params.classId);
        const userLink = (isStudent(userType) ? zStudentLink : zTeacherLink).safeParse(req.body[userType]);

        if (!classId.success) return throwExpressException(400, "invalid classId", next);
        if (!userLink.success) return throwExpressException(400, `invalid ${userType}Link`, next);

        const JWToken = getJWToken(req, next);
    if (!JWToken) return throwExpressException(401, 'no token sent', next);
        const auth1 = await (isStudent(userType) ? doesTokenBelongToStudent : doesTokenBelongToTeacher)(splitId(userLink.data), JWToken);
        if (!auth1.success) return throwExpressException(auth1.errorCode, auth1.errorMessage, next);

        await prisma.$transaction(async (tx) => {
            const waitingroomUserTable = isStudent(userType) ? prisma.waitingroomStudent : prisma.waitingroomTeacher;

            // @ts-ignore
            await waitingroomUserTable.create({
                data: {
                    classes_id: classId.data,
                    [`${userType}s_id`]: splitId(userLink.data)
                }
            });
            const teachers = await tx.teacher.findMany({
                where: {
                    classes_teachers: {
                        some: {classes_id: classId.data}
                    }
                }
            });
            await tx.notification.createMany({
                data: teachers.map(teacher => ({
                            type: "INVITE",
                            read: false,
                            teacher: teacher.id
                        }
                    )
                )
            });
        });
        res.status(200).send({
            [`waitingroom${userType[0].toUpperCase() + userType.slice(1)}`]:
                (isStudent(userType) ? waitingroomStudentLink : waitingroomTeacherLink)(classId.data, splitId(userLink.data))
        });
    }
}

export function patchWaitingroomUserUnion(userType: "student" | "teacher") {
    return async function (req: Request, res: Response, next: NextFunction) {
        const classId = z.coerce.number().safeParse(req.params.classId);
        const userId = z.coerce.number().safeParse(req.params[`${userType}Id`]);

        if (!classId.success) return throwExpressException(400, "invalid classId", next);
        if (!userId.success) return throwExpressException(400, `invalid ${userType}Link`, next);

        const JWToken = getJWToken(req, next);
    if (!JWToken) return throwExpressException(401, 'no token sent', next);
        const auth1 = await doesTokenBelongToTeacher(classId.data, JWToken);
        if (!auth1.success) return throwExpressException(auth1.errorCode, auth1.errorMessage, next);

        await prisma.$transaction(async (tx) => {
            const waitingroomUserTable = isStudent(userType) ? tx.waitingroomStudent : tx.waitingroomTeacher;
            const classUserTable = isStudent(userType) ? tx.classStudent : tx.classTeacher;

            // @ts-ignore
            await waitingroomUserTable.deleteMany({
                where: {
                    classes_id: classId.data,
                    [`${userType}s_id`]: userId.data
                }
            });
            // @ts-ignore
            await classUserTable.create({
                data: {
                    classes_id: classId.data,
                    [`${userType}s_id`]: userId.data
                }
            });
            await tx.notification.create({
                    data: {
                        read: false,
                        type: "INVITE",
                        [userType]: userId.data
                    }
                }
            );
        });
        res.status(200).send();
    }
}

export function deleteWaitingroomUserUnion(userType: "student" | "teacher") {
    return async function (req: Request, res: Response, next: NextFunction) {
        const classId = z.coerce.number().safeParse(req.params.classId);
        const userId = z.coerce.number().safeParse(req.params[`${userType}Id`]);

        if (!classId.success) return throwExpressException(400, "invalid classId", next);
        if (!userId.success) return throwExpressException(400, `invalid ${userType}Link`, next);

        const JWToken = getJWToken(req, next);
    if (!JWToken) return throwExpressException(401, 'no token sent', next);
        const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
        const auth2 = await (isStudent(userType) ? doesTokenBelongToStudent : doesTokenBelongToTeacher)(classId.data, JWToken);
        if (!(auth1.success || auth2.success)) return throwExpressException(
            auth1.errorCode < 300 ? auth2.errorCode : auth1.errorCode,
            `${auth1.errorMessage} and ${auth2.errorMessage}`, next);

        const waitingroomUserTable = isStudent(userType) ? prisma.waitingroomStudent : prisma.waitingroomTeacher;

        await prisma.$transaction(async (tx) => {
            // @ts-ignore
            await waitingroomUserTable.deleteMany({
                where: {
                    classes_id: classId.data,
                    [`${userType}s_id`]: userId.data,
                }
            });
            await tx.notification.create({
                    data: {
                        read: false,
                        type: "INVITE",//todo: type invite rejected
                        [userType]: userId.data
                    }
                }
            );
        });
        res.status(200).send();
    }
}