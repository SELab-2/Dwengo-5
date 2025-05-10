import { Router } from "express";
import { deleteTeacher, getTeacher, } from "../../controllers/teachers/teachersController.ts";
import { authenticate } from "../../controllers/authentication/authenticationMiddleware.ts";
import classesRouter from "./classes/classesRouter.ts";
//import notificationsRouter from "../teachers/notifications/notificationsRouter.ts";

const router = Router({ mergeParams: true });
export default router;

router.use("/:teacherId/classes", classesRouter);
//router.use("/:teacherId/notifications", notificationsRouter);

router.get("/:teacherId", getTeacher);

router.delete("/:teacherId",
    authenticate("teacher"),
    deleteTeacher);
