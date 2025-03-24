import {Router} from "express";
import {
    deleteClassTeacher,
    getClassTeachers,
    postClassTeacher
} from "../../../controllers/classes/teachers/teachersController.ts";

const router = Router({mergeParams: true});
export default router

router.get("/", getClassTeachers);
router.post("/", postClassTeacher);
router.delete("/:teacherId", deleteClassTeacher);