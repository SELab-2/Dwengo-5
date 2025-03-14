import {Router} from "express";
import {
    getClassTeachers,
    deleteClassTeacher,
    postClassTeacher
} from "../../../controllers/classes/teachers/teachersController.ts";

const router = Router({mergeParams: true});
export default router

router.get("/", getClassTeachers);
router.post("/", postClassTeacher);
router.delete("/:teacherstudentId", deleteClassTeacher);