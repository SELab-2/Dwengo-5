import {Router} from "express";
import {authenticate} from "../../../../controllers/authentication/authenticationMiddleware.ts";
import {getStudentAssignments} from "../../../../controllers/users/classes/assignments/assignmentController.ts";
import submissionsRouter from "./submissions/submissionsRouter.ts";
import groupsRouter from "./groups/groupsRouter.ts";

const router = Router({mergeParams: true});
export default router

router.use("/:assignmentId/submissions", submissionsRouter);
router.use("/:assignmentId/groups", groupsRouter);

router.get("/", authenticate, getStudentAssignments);