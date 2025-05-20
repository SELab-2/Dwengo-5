import { Router } from "express";
import {
    getStudentAssignmentGroup
} from "../../../../../controllers/users/classes/assignments/group/groupController.ts";
import submissionsRouter from "./submissions/submissionsRouter.ts";

const router = Router({ mergeParams: true });
export default router

router.use("/:groupId/submissions", submissionsRouter);
router.get("/", getStudentAssignmentGroup);