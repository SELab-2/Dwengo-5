import {Router} from "express";
import {
    deleteClassStudent,
    getClassStudents,
    getClassStudent
} from "../../../controllers/classes/students/studentsController.ts";

import infoRouter from "./info/infoRouter.ts";
import conversationsRouter from "./conversations/conversationsRouter.ts";

const router = Router({mergeParams: true});
export default router

router.use("/info", infoRouter);
router.use("/:studentId/conversations", conversationsRouter);

router.get("/", getClassStudents);
router.get("/:studentId", getClassStudent);
router.delete("/:studentId", deleteClassStudent);
