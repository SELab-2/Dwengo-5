import {NextFunction, Request, Response} from "express";
import {z} from "zod";
import {throwExpressException} from "../../exceptions/ExpressException.ts";
import {prisma} from "../../index.ts";
import {studentNotificationLink, teacherNotificationLink} from "../../help/links.ts";

function isStudent(userType: "student" | "teacher") {
    return userType == "student";
}

export async function getAllNotifications(req: Request, res: Response, next: NextFunction) {
    const usertype = z.enum(["student", "teacher"]).safeParse(req.query.usertype);
    //success check is done early because it is needed for the rest
    if (!usertype.success) return throwExpressException(400, "invalid usertype", next);

    const userId = z.coerce.number().safeParse(req.query.userId);
    if (!userId.success) return throwExpressException(400, `invalid ${usertype.data}Id`, next);

    const userTable = isStudent(usertype.data) ? prisma.student : prisma.teacher;

    // @ts-ignore
    const user = userTable.findUnique({
        where: {id: userId.data}
    });
    if (!user) return throwExpressException(404, `${usertype.data} not found`, next);

    const notifications = await prisma.notification.findMany({
        where: {[usertype.data]: userId.data},
    });

    const notificationLinks = notifications.map(notification => {
        return (isStudent(usertype.data) ? studentNotificationLink : teacherNotificationLink)(userId.data, notification.id)
    });

    res.status(200).send({notifications: notificationLinks});
}

export async function getNotification(req: Request, res: Response, next: NextFunction) {
    const usertype = z.enum(["student", "teacher"]).safeParse(req.query.usertype);
    //success check is done early because it is needed for the rest
    if (!usertype.success) return throwExpressException(400, "invalid usertype", next);

    const userId = z.coerce.number().safeParse(req.query.userId);
    const notificationId = z.coerce.number().safeParse(req.params.notificationId);

    if (!notificationId.success) return throwExpressException(400, "invalid notificationId", next);
    if (!userId.success) return throwExpressException(400, `invalid ${usertype.data}Id`, next);

    const userTable = isStudent(usertype.data) ? prisma.student : prisma.teacher;

    // @ts-ignore
    const user = userTable.findUnique({
        where: {id: userId.data}
    });
    if (!user) return throwExpressException(404, `${usertype.data} not found`, next);

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
    const usertype = z.enum(["student", "teacher"]).safeParse(req.query.usertype);
    //success check is done early because it is needed for the rest
    if (!usertype.success) return throwExpressException(400, "invalid usertype", next);

    const userId = z.coerce.number().safeParse(req.query.userId);
    const notificationId = z.coerce.number().safeParse(req.params.notificationId);
    if (!userId.success) return throwExpressException(400, `invalid ${usertype.data}Id`, next);
    if (!notificationId.success) return throwExpressException(400, "invalid notificationId", next);

    const userTable = isStudent(usertype.data) ? prisma.student : prisma.teacher;

    // @ts-ignore
    const user = userTable.findUnique({
        where: {id: userId.data}
    });
    if (!user) return throwExpressException(404, `${usertype.data} not found`, next);

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
    const usertype = z.enum(["student", "teacher"]).safeParse(req.query.usertype);
    //success check is done early because it is needed for the rest
    if (!usertype.success) return throwExpressException(400, "invalid usertype", next);

    const userId = z.coerce.number().safeParse(req.query.userId);
    const notificationId = z.coerce.number().safeParse(req.params.notificationId);
    if (!userId.success) return throwExpressException(400, `invalid ${usertype.data}Id`, next);
    if (!notificationId.success) return throwExpressException(400, "invalid notificationId", next);

    const userTable = isStudent(usertype.data) ? prisma.student : prisma.teacher;

    // @ts-ignore
    const user = userTable.findUnique({
        where: {id: userId.data}
    });
    if (!user) return throwExpressException(404, `${usertype.data} not found`, next);

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