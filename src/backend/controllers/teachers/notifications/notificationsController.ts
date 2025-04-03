import {NextFunction, Request, Response} from "express";
import {throwExpressException} from "../../../exceptions/ExpressException.ts";
import {z} from "zod";
import {prisma} from "../../../index.ts";
import {
    deleteNotificationUnion,
    getAllNotificationsUnion,
    getNotificationUnion, patchNotificationUnion
} from "../../teacherStudentUnions/notificationsControllerUnion.ts";

export const getAllNotifications = getAllNotificationsUnion("teacher");

export const getNotification = getNotificationUnion("teacher");

export const deleteNotification = deleteNotificationUnion("teacher");

export const patchNotification = patchNotificationUnion("teacher");