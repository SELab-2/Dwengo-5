import {Router} from "express";
import {
    deleteWaitingroomStudent,
    getWaitingroomStudents, patchWaitingroomStudent,
    postWaitingroomStudent
} from "../../../../controllers/classes/waitingroom/students/studentsController.ts";

const router = Router({mergeParams: true});
export default router

router.get("/", getWaitingroomStudents);
router.post("/", postWaitingroomStudent);
router.patch("/:studentId", patchWaitingroomStudent);
router.delete("/:studentId", deleteWaitingroomStudent);
