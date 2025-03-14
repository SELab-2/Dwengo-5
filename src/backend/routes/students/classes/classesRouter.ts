import {Router} from "express";
import opdrachten_router from "./assignments/assignmentsRouter.ts";
import {getStudentClasses} from "../../../controllers/students/classes/classesController.ts";
import {authenticate} from "../../../controllers/authentication/commonAuthenticationController.ts";

const router = Router({mergeParams: true});
export default router

router.use("/:classId/assignments", opdrachten_router);

router.get("/", (req, res, next) => {
    const studentId = Number(req.params.studentId);
    authenticate(studentId)(req, res, next);
}, getStudentClasses);
