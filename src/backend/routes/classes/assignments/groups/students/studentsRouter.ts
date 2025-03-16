import {Router} from "express";
import {
    deleteGroupStudent,
    getGroupStudents,
    postGroupStudent
} from "../../../../../controllers/classes/assignments/groups/students/studentsController.ts";

const router = Router({mergeParams: true});
export default router

router.get("/", getGroupStudents);
router.post("/", postGroupStudent);
router.delete("/:studentId", deleteGroupStudent);
