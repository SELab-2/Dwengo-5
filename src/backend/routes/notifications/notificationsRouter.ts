import {Router} from "express";
import {authenticate} from "../../controllers/authentication/authenticationMiddleware.ts";
import {
    deleteNotification,
    getAllNotifications,
    getNotification,
    patchNotification
} from "../../controllers/notifications/notificationsController.ts";

const router = Router({mergeParams: true});
export default router;

router.get("/:notificationId", getNotification);
router.get("/", getAllNotifications);
router.delete("/:notificationId", deleteNotification);
router.patch("/:notificationId", patchNotification);