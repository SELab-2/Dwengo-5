import {Router} from "express";

import klassen_router from "./classes/classesRouter.ts";
import {getStudent, deleteStudent} from "../../controllers/students/studentsController.ts";
import {authenticate} from "../../controllers/authentication/commonAuthenticationController.ts";

const router = Router({mergeParams: true});
export default router

router.use("/:studentId/classes", klassen_router);

router.get("/:studentId", getStudent);
router.delete("/:studentId", (req, res, next) => {
    const studentId = Number(req.params.studentId);
    authenticate(studentId)(req, res, next);
}, deleteStudent);