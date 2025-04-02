import {NextFunction, Request, Response} from "express";
import {throwExpressException} from "../../../exceptions/ExpressException.ts";
import {z} from "zod";
import {prisma} from "../../../index.ts";
import {studentNotificationLink} from "../../../help/links.ts";
import {NotificationType} from "@prisma/client"; // Import the generated Prisma enum


export async function getAllNotifications(req: Request, res: Response, next: NextFunction) {
    const studentId = z.coerce.number().safeParse(req.params.studentId);
    if (!studentId.success) return throwExpressException(400, "invalid studentId", next);

    const student = prisma.student.findUnique({
        where: {id: studentId.data}
    });
    if (!student) return throwExpressException(404, "student not found", next);

    const notifications = await prisma.notification.findMany({
        where: {student: studentId.data},
    });

    const notificationLinks = notifications.map(notification => {
        return studentNotificationLink(studentId.data, notification.id)
    });

    res.status(200).send({notifications: notificationLinks});
}

export async function getNotification(req: Request, res: Response, next: NextFunction) {
    const studentId = z.coerce.number().safeParse(req.params.studentId);
    const notificationId = z.coerce.number().safeParse(req.params.notificationId);
    if (!studentId.success) return throwExpressException(400, "invalid studentId", next);
    if (!notificationId.success) return throwExpressException(400, "invalid notificationId", next);

    const student = prisma.student.findUnique({
        where: {id: studentId.data}
    });
    if (!student) return throwExpressException(404, "student not found", next);

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
    const studentId = z.coerce.number().safeParse(req.params.studentId);
    const notificationId = z.coerce.number().safeParse(req.params.notificationId);
    if (!notificationId.success) return throwExpressException(400, "invalid notificationId", next);
    if (!studentId.success) return throwExpressException(400, "invalid studentId", next);

    const student = prisma.student.findUnique({
        where: {id: studentId.data}
    });
    if (!student) return throwExpressException(404, "student not found", next);

    const notification = await prisma.notification.findFirst({
        where: {id: notificationId.data}
    });

    if (!notification) return throwExpressException(404, "notification not found", next);

    await prisma.notification.delete({
        where: {id: notificationId.data}
    });

    res.status(200).send();
}

//TODO: delete constroller pls
export async function postNotification(req: Request, res: Response, next: NextFunction) {
    const studentId = z.coerce.number().safeParse(req.params.studentId);
    if (!studentId.success) return throwExpressException(400, "invalid studentId", next);
    const notification = z.object({type: z.nativeEnum(NotificationType)}).safeParse(req.body);
    if (!notification.success) return throwExpressException(400, "invalid notification", next);

    const student = prisma.student.findUnique({
        where: {id: studentId.data}
    });
    if (!student) return throwExpressException(404, "student not found", next);

    const notifCreate = await prisma.notification.create({
        data: {
            type: notification.data.type,
            read: false,
            student: studentId.data
        }
    });
    if (!notifCreate) return throwExpressException(500, "notification not created", next);

    res.status(200).send();
}

export async function patchNotification(req: Request, res: Response, next: NextFunction) {
    const studentId = z.coerce.number().safeParse(req.params.studentId);
    const notificationId = z.coerce.number().safeParse(req.params.notificationId);
    if (!studentId.success) return throwExpressException(400, "invalid studentId", next);
    if (!notificationId.success) return throwExpressException(400, "invalid notificationId", next);

    const student = prisma.student.findUnique({
        where: {id: studentId.data}
    });
    if (!student) return throwExpressException(404, "student not found", next);

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