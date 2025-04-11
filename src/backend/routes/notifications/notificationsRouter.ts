import {Router} from "express";
import {authenticate} from "../../controllers/authentication/authenticationMiddleware.ts";
import {
    deleteNotification,
    getAllNotifications,
    getNotification,
    patchNotification
} from "../../controllers/user/notifications/notificationsController.ts";

const router = Router({mergeParams: true});
export default router;

router.get("/", authenticate("student"), getAllNotifications);
router.get("/:notificationId", authenticate('student'), getNotification);
router.delete("/:notificationId", authenticate("student"), deleteNotification);
router.patch("/:notificationId", authenticate("student"), patchNotification);