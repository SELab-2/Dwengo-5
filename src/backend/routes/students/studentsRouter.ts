import {Router} from "express";
import {deleteStudent, getStudent} from "../../controllers/students/studentsController.ts";
import {authenticate} from "../../controllers/authentication/commonAuthenticationController.ts";
import classesRouter from "./classes/classesRouter.ts";

const router = Router({mergeParams: true});
export default router

router.use("/:studentId/classes", classesRouter);

router.get("/:studentId", getStudent);
router.delete("/:studentId", (req, res, next) => {
    const studentId = Number(req.params.studentId);
    authenticate(studentId)(req, res, next);
}, deleteStudent);