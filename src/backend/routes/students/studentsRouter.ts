import {Router} from "express";
import {deleteStudent, getStudent} from "../../controllers/students/studentsController.ts";
import {authenticate} from "../../controllers/authentication/authenticationMiddleware.ts";
import classesRouter from "./classes/classesRouter.ts";
import notificationsRouter from "./notifications/notificationsRouter.ts";

const router = Router({mergeParams: true});
export default router

router.use("/:studentId/classes", classesRouter);
router.use("/:studentId/notifications", notificationsRouter);

router.get("/:studentId", getStudent);
router.delete("/:studentId", authenticate("student"), deleteStudent);