import {Router} from "express";
import {
    deleteClassTeacher,
    getClassTeachers,
} from "../../../controllers/classes/teachers/teachersController.ts";

const router = Router({mergeParams: true});
export default router

router.get("/", getClassTeachers);
router.delete("/:teacherId", deleteClassTeacher);
