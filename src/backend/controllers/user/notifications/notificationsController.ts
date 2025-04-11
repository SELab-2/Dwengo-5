import {NextFunction, Request, Response} from "express";
import {z} from "zod";
import {throwExpressException} from "../../../exceptions/ExpressException.ts";
import {prisma} from "../../../index.ts";
import {userNotificationLink} from "../../../help/links.ts";

export async function getAllNotifications(req: Request, res: Response, next: NextFunction) {
    const userId = z.coerce.number().safeParse(req.params[`userId`]);
    if (!userId.success) return throwExpressException(400, `invalid userId`, next);

    const user = prisma.user.findUnique({
        where: {id: userId.data}
    });
    if (!user) return throwExpressException(404, `user not found`, next);

    const notifications = await prisma.notification.findMany({
        where: {user_id: userId.data}
    });

    const notificationLinks = notifications.map(notification => {
        return userNotificationLink(userId.data, notification.id)
    });

    res.status(200).send({notifications: notificationLinks});
}

export async function getNotification(req: Request, res: Response, next: NextFunction) {
    const userId = z.coerce.number().safeParse(req.params[`userId`]);
    const notificationId = z.coerce.number().safeParse(req.params.notificationId);

    if (!notificationId.success) return throwExpressException(400, "invalid notificationId", next);
    if (!userId.success) return throwExpressException(400, `invalid userId`, next);

    const user = prisma.user.findUnique({
        where: {id: userId.data}
    });
    if (!user) return throwExpressException(404, `user not found`, next);

    const notification = await prisma.notification.findFirst({
        where: {id: notificationId.data}
    });
    if (!notification) return throwExpressException(404, "notification not found", next);

    res.status(200).send({
        type: notification.type,
        read: notification.read
    });
}

export async function deleteNotification(req: Request, res: Response, next: NextFunction) {
    const userId = z.coerce.number().safeParse(req.params[`userId`]);
    const notificationId = z.coerce.number().safeParse(req.params.notificationId);
    if (!userId.success) return throwExpressException(400, `invalid userId`, next);
    if (!notificationId.success) return throwExpressException(400, "invalid notificationId", next);

    const user = prisma.user.findUnique({
        where: {id: userId.data}
    });
    if (!user) return throwExpressException(404, `user not found`, next);

    const notification = await prisma.notification.findFirst({
        where: {id: notificationId.data}
    });

    if (!notification) return throwExpressException(404, "notification not found", next);

    await prisma.notification.delete({
        where: {id: notificationId.data}
    });

    res.status(200).send();
}

export async function patchNotification(req: Request, res: Response, next: NextFunction) {
    const userId = z.coerce.number().safeParse(req.params[`userId`]);
    const notificationId = z.coerce.number().safeParse(req.params.notificationId);
    if (!userId.success) return throwExpressException(400, `invalid userId`, next);
    if (!notificationId.success) return throwExpressException(400, "invalid notificationId", next);

    const user = prisma.user.findUnique({
        where: {id: userId.data}
    });
    if (!user) return throwExpressException(404, `user not found`, next);

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