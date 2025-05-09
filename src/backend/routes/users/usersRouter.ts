import {Router} from "express";
import {authenticate} from "../../controllers/authentication/authenticationMiddleware.ts";
import classesRouter from "./classes/classesRouter.ts";
import {deleteUser, getUser, patchUser} from "../../controllers/users/userController.ts";
import notificationsRouter from "./notifications/notificationsRouter.ts";

const router = Router({ mergeParams: true });
export default router

router.use("/:userId/classes", classesRouter);
router.use("/:userId/notifications", notificationsRouter);

router.get("/:userId", getUser);
router.patch("/:userId", authenticate, patchUser);
router.delete("/:userId", authenticate, deleteUser);