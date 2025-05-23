import { Router } from "express";
import {
    deleteAssignmentGroup, getAssignmentGroup,
    getAssignmentGroups,
    postAssignmentGroup
} from "../../../../controllers/classes/assignments/groups/groupsController.ts";

import studentsRouter from "./students/studentsRouter.ts";
import conversationsRouter from "./conversations/conversationsRouter.ts";
import submissionsRouter from "./submissions/SubmissionsRouter.ts";

const router = Router({ mergeParams: true });
export default router

router.use("/:groupId/students", studentsRouter);
router.use("/:groupId/conversations", conversationsRouter);
router.use("/:groupId/submissions", submissionsRouter);

router.get("/", getAssignmentGroups);
router.post("/", postAssignmentGroup);
router.delete("/:groupId", deleteAssignmentGroup);
router.get("/:groupId", getAssignmentGroup);