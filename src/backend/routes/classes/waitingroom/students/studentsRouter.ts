import {Router} from "express";
import {
    deleteWaitingroomStudent,
    getWaitingroomStudents,
    patchWaitingroomStudent,
    postWaitingroomStudent
} from "../../../../controllers/classes/waitingroom/students/studentsController.ts";

const router = Router({mergeParams: true});
export default router

router.get("/", getWaitingroomStudents);
router.post("/", postWaitingroomStudent);
router.patch("/:teacherId", patchWaitingroomStudent);
router.delete("/:teacherId", deleteWaitingroomStudent);
