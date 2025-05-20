import { Router } from "express";
import { authenticate } from "../../../controllers/authentication/authenticationMiddleware.ts";
import {
    deleteNotification,
    getAllNotifications,
    getNotification,
    patchNotification
} from "../../../controllers/users/notifications/notificationsController.ts";

const router = Router({ mergeParams: true });
export default router;

router.get("/", authenticate, getAllNotifications);
router.get("/:notificationId", authenticate, getNotification);
router.delete("/:notificationId", authenticate, deleteNotification);
router.patch("/:notificationId", authenticate, patchNotification);