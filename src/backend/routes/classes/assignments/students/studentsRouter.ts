import {Router} from "express";
import {
    deleteAssignmentStudent,
    getAssignmentStudents,
    postAssignmentStudent
} from "../../../../controllers/classes/assignments/students/studentsController.ts";

const router = Router({mergeParams: true});
export default router

router.get("/", getAssignmentStudents);
router.post("/", postAssignmentStudent);
router.delete("/:studentId", deleteAssignmentStudent);