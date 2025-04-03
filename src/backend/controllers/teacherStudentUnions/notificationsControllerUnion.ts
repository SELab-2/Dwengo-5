import {NextFunction, Request, Response} from "express";
import {z} from "zod";
import {throwExpressException} from "../../exceptions/ExpressException.ts";
import {prisma} from "../../index.ts";
import {studentNotificationLink, teacherNotificationLink} from "../../help/links.ts";

function isStudent(userType: "student" | "teacher") {
    return userType == "student";
}

export function getAllNotificationsUnion(userType: "student" | "teacher") {
    return async function (req: Request, res: Response, next: NextFunction) {
        const userId = z.coerce.number().safeParse(req.params[`${userType}Id`]);
        if (!userId.success) return throwExpressException(400, `invalid ${userType}Id`, next);

        const userTable = isStudent(userType) ? prisma.student : prisma.teacher;

        // @ts-ignore
        const user = userTable.findUnique({
            where: {id: userId.data}
        });
        if (!user) return throwExpressException(404, `${userType} not found`, next);

        const notifications = await prisma.notification.findMany({
            where: {[userType]: userId.data},
        });

        const notificationLinks = notifications.map(notification => {
            return (isStudent(userType) ? studentNotificationLink : teacherNotificationLink)(userId.data, notification.id)
        });

        res.status(200).send({notifications: notificationLinks});
    }
}

export function getNotificationUnion(userType: "student" | "teacher") {
    return async function (req: Request, res: Response, next: NextFunction) {
        const userId = z.coerce.number().safeParse(req.params[`${userType}Id`]);
        const notificationId = z.coerce.number().safeParse(req.params.notificationId);

        if (!notificationId.success) return throwExpressException(400, "invalid notificationId", next);
        if (!userId.success) return throwExpressException(400, `invalid ${userType}Id`, next);

        const userTable = isStudent(userType) ? prisma.student : prisma.teacher;

        // @ts-ignore
        const user = userTable.findUnique({
            where: {id: userId.data}
        });
        if (!user) return throwExpressException(404, `${userType} not found`, next);

        const notification = await prisma.notification.findFirst({
            where: {id: notificationId.data}
        });
        if (!notification) return throwExpressException(404, "notification not found", next);

        res.status(200).send({
            type: notification.type,
            read: notification.read
        });
    }
}

export async function deleteNotificationUnion(userType: "student" | "teacher") {
    return async function (req: Request, res: Response, next: NextFunction) {
        const userId = z.coerce.number().safeParse(req.params[`${userType}Id`]);
        const notificationId = z.coerce.number().safeParse(req.params.notificationId);
        if (!userId.success) return throwExpressException(400, `invalid ${userType}Id`, next);
        if (!notificationId.success) return throwExpressException(400, "invalid notificationId", next);

        const userTable = isStudent(userType) ? prisma.student : prisma.teacher;

        // @ts-ignore
        const user = userTable.findUnique({
            where: {id: userId.data}
        });
        if (!user) return throwExpressException(404, `${userType} not found`, next);

        const notification = await prisma.notification.findFirst({
            where: {id: notificationId.data}
        });

        if (!notification) return throwExpressException(404, "notification not found", next);

        await prisma.notification.delete({
            where: {id: notificationId.data}
        });

        res.status(200).send();
    }
}

export async function patchNotificationUnion(userType: "student" | "teacher") {
    return async function (req: Request, res: Response, next: NextFunction) {
        const userId = z.coerce.number().safeParse(req.params[`${userType}Id`]);
        const notificationId = z.coerce.number().safeParse(req.params.notificationId);
        if (!userId.success) return throwExpressException(400, `invalid ${userType}Id`, next);
        if (!notificationId.success) return throwExpressException(400, "invalid notificationId", next);

        const userTable = isStudent(userType) ? prisma.student : prisma.teacher;

        // @ts-ignore
        const user = userTable.findUnique({
            where: {id: userId.data}
        });
        if (!user) return throwExpressException(404, `${userType} not found`, next);

        const notification = await prisma.notification.findFirst({
            where: {id: notificationId.data}
        });
        if (!notification) return throwExpressException(404, "notification not found", next);

        await prisma.notification.update({
            where: {id: notificationId.data},
            data: {
                read: true
            }
        })

        res.status(200).send();
    }
}