import {Router} from "express";
import {
    deleteAssignmentStudent,
    getAssignmentStudents
} from "../../../../controllers/classes/assignments/students/studentsController.ts";

const router = Router({mergeParams: true});
export default router

router.get("/", getAssignmentStudents);
router.delete("/:studentId", deleteAssignmentStudent);