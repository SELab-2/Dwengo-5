import {NextFunction, Request, Response} from "express";
import {throwExpressException} from "../../exceptions/ExpressException.ts";
import {z} from "zod";
import {prisma} from "../../index.ts";
import {studentNotificationLink, teacherNotificationLink} from "../../help/links.ts";

export async function getAllNotificationsUnion(userType: "student" | "teacher") {
    return async function (req: Request, res: Response, next: NextFunction) {
        const userId = z.coerce.number().safeParse(req.params[`${userType}Id`]);
        if (!userId.success) return throwExpressException(400, `invalid ${userType}Id`, next);

        const table = userType == "student" ? prisma.student : prisma.teacher;

        // @ts-ignore
        const user = table.findUnique({
            where: {id: userId.data}
        });
        if (!user) return throwExpressException(404, `${userType} not found`, next);

        const notifications = await prisma.notification.findMany({
            where: {[userType]: userId.data},
        });

        const notificationLinks = notifications.map(notification => {
            return (userType == "student" ? studentNotificationLink : teacherNotificationLink)(userId.data, notification.id)
        });

        res.status(200).send({notifications: notificationLinks});
    }
}

export async function getNotificationUnion(userType: "student" | "teacher") {
    return async function (req: Request, res: Response, next: NextFunction) {
        const teacherId = z.coerce.number().safeParse(req.params.teacherId);
        const notificationId = z.coerce.number().safeParse(req.params.notificationId);
        if (!notificationId.success) return throwExpressException(400, "invalid notificationId", next);
        if (!teacherId.success) return throwExpressException(400, "invalid teacherId", next);

        const teacher = prisma.teacher.findUnique({
            where: {id: teacherId.data}
        });
        if (!teacher) return throwExpressException(404, "teacher not found", next);

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
        const teacherId = z.coerce.number().safeParse(req.params.teacherId);
        const notificationId = z.coerce.number().safeParse(req.params.notificationId);
        if (!teacherId.success) return throwExpressException(400, "invalid teacherId", next);
        if (!notificationId.success) return throwExpressException(400, "invalid notificationId", next);

        const teacher = prisma.teacher.findUnique({
            where: {id: teacherId.data}
        });
        if (!teacher) return throwExpressException(404, "teacher not found", next);

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
        const teacherId = z.coerce.number().safeParse(req.params.teacherId);
        const notificationId = z.coerce.number().safeParse(req.params.notificationId);
        if (!teacherId.success) return throwExpressException(400, "invalid teacherId", next);
        if (!notificationId.success) return throwExpressException(400, "invalid notificationId", next);

        const teacher = prisma.teacher.findUnique({
            where: {id: teacherId.data}
        });
        if (!teacher) return throwExpressException(404, "teacher not found", next);


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