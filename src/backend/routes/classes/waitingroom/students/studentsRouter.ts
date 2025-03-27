import {Router} from "express";

import {
    deleteWaitingroomTeacher,
    getWaitingroomTeacher, patchWaitingroomTeacher,
    postWaitingroomTeacher
} from "../../../../controllers/classes/waitingroom/teachers/teachersController.ts";
import {
    deleteWaitingroomStudent,
    getWaitingroomStudent, patchWaitingroomStudent,
    postWaitingroomStudent
} from "../../../../controllers/classes/waitingroom/students/studentsController.ts";

const router = Router({mergeParams: true});
export default router

router.get("/", getWaitingroomStudent);
router.post("/", postWaitingroomStudent);
router.patch("/:teacherId", patchWaitingroomStudent);
router.delete("/:teacherId", deleteWaitingroomStudent);
