import {Router} from "express";
import {authenticate} from "../../../../controllers/authentication/authenticationMiddleware.ts";
import {getStudentAssignments} from "../../../../controllers/user/classes/assignments/assignmentController.ts";

const router = Router({mergeParams: true});
export default router

router.get("/", authenticate, getStudentAssignments);