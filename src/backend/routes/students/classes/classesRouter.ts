import {Router} from "express";
import {getStudentClasses} from "../../../controllers/students/classes/classesController.ts";
import {authenticate} from "../../../controllers/authentication/authenticationMiddleware.ts";
import assignmentsRouter from "./assignments/assignmentsRouter.ts";

const router = Router({mergeParams: true});
export default router

router.use("/:classId/assignments", assignmentsRouter);

router.get("/",
    authenticate("student"),
    getStudentClasses);
