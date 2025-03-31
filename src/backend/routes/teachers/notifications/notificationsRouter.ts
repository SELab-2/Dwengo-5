import {Router} from "express";
import {authenticate} from "../../../controllers/authentication/authenticationMiddleware.ts";
import {
    deleteNotification,
    getAllNotifications,
    getNotification, patchNotification, postNotification
} from "../../../controllers/teachers/notifications/notificationsController.ts";

const router = Router({mergeParams: true});
export default router

router.get("/", authenticate("teacher"), getAllNotifications);
router.post("/", authenticate("teacher"), postNotification);
router.get("/:notificationId", authenticate('teacher'), getNotification);
router.delete("/:notificationId", authenticate("teacher"), deleteNotification);
router.patch("/:notificationId", authenticate("teacher"), patchNotification);