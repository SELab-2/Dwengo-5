import {Router} from "express";
import {getUserAssignments} from "../../../../controllers/user/classes/assignments/assignmentController.ts";
import {authenticate} from "../../../../controllers/authentication/authenticationMiddleware.ts";

const router = Router({mergeParams: true});
export default router

router.get("/", authenticate, getUserAssignments);