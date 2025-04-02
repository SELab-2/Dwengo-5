import {Router} from "express";
import {getStudentAssignments} from "../../../../controllers/students/classes/assignments/assignmentController.ts";
import {authenticate} from "../../../../controllers/authentication/authenticationMiddleware.ts";

const router = Router({mergeParams: true});
export default router

router.get("/", authenticate("student"), getStudentAssignments);