import {
    deleteNotificationUnion,
    getAllNotificationsUnion,
    getNotificationUnion, patchNotificationUnion
} from "../../teacherStudentUnions/notificationsControllerUnion.ts";

export const getAllNotifications = getAllNotificationsUnion("teacher");

export const getNotification = getNotificationUnion("teacher");

export const deleteNotification = deleteNotificationUnion("teacher");

export const patchNotification = patchNotificationUnion("teacher");