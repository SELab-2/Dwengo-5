import { Router } from "express";
import {
    deleteClassStudent,
    getClassStudents,
    getClassStudent,
    patchClassStudent
} from "../../../controllers/classes/students/studentsController.ts";

import conversationsRouter from "./conversations/conversationsRouter.ts";

const router = Router({ mergeParams: true });
export default router

router.use("/:studentId/conversations", conversationsRouter);

router.get("/", getClassStudents);
router.get("/:studentId", getClassStudent);
router.delete("/:studentId", deleteClassStudent);
router.patch("/:studentId", patchClassStudent);
