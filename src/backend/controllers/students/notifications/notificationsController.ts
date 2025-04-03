import {
    deleteNotificationUnion,
    getAllNotificationsUnion,
    getNotificationUnion, patchNotificationUnion
} from "../../teacherStudentUnions/notificationsControllerUnion.ts"; // Import the generated Prisma enum


export const getAllNotifications = getAllNotificationsUnion("student");

export const getNotification = getNotificationUnion("student");

export const deleteNotification = deleteNotificationUnion("student");

export const patchNotification = patchNotificationUnion("student");