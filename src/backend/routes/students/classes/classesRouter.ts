import {Router} from "express";
import {authenticate} from "../../../controllers/authentication/authenticationMiddleware.ts";
import assignmentsRouter from "./assignments/assignmentsRouter.ts";
import {getUserClasses} from "../../../controllers/user/classes/classesController.ts";

const router = Router({mergeParams: true});
export default router

router.use("/:classId/assignments", assignmentsRouter);

router.get("/", authenticate, getUserClasses);
