import {NextFunction, Request, Response} from "express";
import {z} from "zod";
import {throwExpressException} from "../../../exceptions/ExpressException.ts";
import {
    doesTokenBelongToTeacher,
    doesTokenBelongToTeacherInClass,
    doesTokenBelongToUser,
    getJWToken
} from "../../authentication/extraAuthentication.ts";
import {prisma} from "../../../index.ts";
import {splitId, studentLink, waitingroomUserLink} from "../../../help/links.ts";
import {zUserLink} from "../../../help/validation.ts";

export async function getWaitingroomUsers(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    if (!classId.success) return throwExpressException(400, "invalid classId", next);

    const JWToken = getJWToken(req, next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    if (!auth1.success) return throwExpressException(auth1.errorCode, auth1.errorMessage, next);

    const users = await prisma.waitingroomUser.findMany({
        where: {class_id: classId.data}
    })

    const userLinks = users.map(user => studentLink(user.user_id));
    res.status(200).send({[`users`]: userLinks});
}

export async function postWaitingroomUser(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const userLink = zUserLink.safeParse(req.body.user);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!userLink.success) return throwExpressException(400, `invalid userLink`, next);

    const JWToken = getJWToken(req, next);
    const auth1 = await doesTokenBelongToUser(splitId(userLink.data), JWToken);
    if (!auth1.success) return throwExpressException(auth1.errorCode, auth1.errorMessage, next);

    await prisma.$transaction(async (tx) => {
        await prisma.classUser.create({
            data: {
                class_id: classId.data,
                user_id: splitId(userLink.data)
            }
        });
        const teachers = await tx.teacher.findMany({
            where: {user: {classes: {some: {class_id: classId.data}}}}
        });
        await tx.notification.createMany({
            data: teachers.map(teacher => ({
                        type: "INVITE",
                        read: false,
                        user_id: teacher.id
                    }
                )
            )
        });
    });
    res.status(200).send({waitingroomUsers: waitingroomUserLink(classId.data, splitId(userLink.data))});
}

export async function patchWaitingroomUser(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const userId = z.coerce.number().safeParse(req.params[`userId`]);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!userId.success) return throwExpressException(400, `invalid userLink`, next);

    const JWToken = getJWToken(req, next);
    const auth1 = await doesTokenBelongToTeacher(classId.data, JWToken);
    if (!auth1.success) return throwExpressException(auth1.errorCode, auth1.errorMessage, next);

    await prisma.$transaction(async (tx) => {
        await prisma.waitingroomUser.deleteMany({
            where: {
                class_id: classId.data,
                user_id: userId.data
            }
        });
        await prisma.classUser.create({
            data: {
                class_id: classId.data,
                user_id: userId.data
            }
        });
        await tx.notification.create({
                data: {
                    read: false,
                    type: "INVITE",
                    user_id: userId.data
                }
            }
        );
    });
    res.status(200).send();
}

export async function deleteWaitingroomUser(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const userId = z.coerce.number().safeParse(req.params[`userId`]);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!userId.success) return throwExpressException(400, `invalid userLink`, next);

    const JWToken = getJWToken(req, next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    const auth2 = await doesTokenBelongToUser(classId.data, JWToken);
    if (!(auth1.success || auth2.success)) return throwExpressException(
        auth1.errorCode < 300 ? auth2.errorCode : auth1.errorCode,
        `${auth1.errorMessage} and ${auth2.errorMessage}`, next);

    await prisma.$transaction(async (tx) => {
        await prisma.waitingroomUser.deleteMany({
            where: {
                class_id: classId.data,
                user_id: userId.data
            }
        });
        await tx.notification.create({
                data: {
                    read: false,
                    type: "INVITE",//todo: type invite rejected
                    user_id: userId.data
                }
            }
        );
    });
    res.status(200).send();
}

export async function getWaitingroom(req: Request, res: Response, next: NextFunction) {
    res.send({
        links: {
            users: req.originalUrl + "/users",
        }
    })
}