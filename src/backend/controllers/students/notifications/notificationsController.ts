import {NextFunction, Request, Response} from "express";
import {throwExpressException} from "../../../exceptions/ExpressException.ts";
import {z} from "zod";
import {prisma} from "../../../index.ts";
import {NotificationType} from "@prisma/client";
import {
    deleteNotificationUnion,
    getAllNotificationsUnion,
    getNotificationUnion, patchNotificationUnion
} from "../../teacherStudentUnions/notificationsControllerUnion.ts"; // Import the generated Prisma enum


export const getAllNotifications = getAllNotificationsUnion("student");

export const getNotification = getNotificationUnion("student");

export const deleteNotification = deleteNotificationUnion("student");
//stijn was hier
export const patchNotification = patchNotificationUnion("student");