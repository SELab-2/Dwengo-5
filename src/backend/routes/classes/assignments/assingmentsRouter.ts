import {Router} from "express";
import {
    deleteClassAssignment,
    getClassAssignment,
    getClassAssignments,
    postClassAssignment
} from "../../../controllers/classes/assignments/assignmentsController.ts";

import studentsRouter from "./students/studentsRouter.ts";
import groupsRouter from "./groups/groupsRouter.ts";
import conversationsRouter from "./conversations/conversationsRouter.ts";

const router = Router({mergeParams: true});
export default router

router.use("/:assignmentId/students", studentsRouter);
router.use("/:assignmentId/groups", groupsRouter);
router.use("/:assignmentId/conversations", conversationsRouter);

router.get("/", getClassAssignments);
router.post("/", postClassAssignment);
router.get("/:assignmentId", getClassAssignment);
router.delete("/:assignmentId", deleteClassAssignment);