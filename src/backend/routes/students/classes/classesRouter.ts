import {Router} from "express";
import {getStudentClasses} from "../../../controllers/students/classes/classesController.ts";
import {authenticate} from "../../../controllers/authentication/commonAuthenticationController.ts";
import assignmentsRouter from "./assignments/assignmentsRouter.ts";

const router = Router({mergeParams: true});
export default router

router.use("/:classId/assignments", assignmentsRouter);

router.get("/", (req, res, next) => {
    const studentId = Number(req.params.studentId);
    authenticate(studentId)(req, res, next);
}, getStudentClasses);
