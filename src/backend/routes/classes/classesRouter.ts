import {Router} from "express";
import {deleteClass, getClass, postClass} from "../../controllers/classes/classesController.ts";

import infoRouter from "./info/infoRouter.ts";
import teachersRouter from "./teachers/teachersRouter.ts";
import studentsRouter from "./students/studentsRouter.ts";
import assignmentsRouter from "./assignments/assingmentsRouter.ts";
import conversationsRouter from "./conversations/conversationsRouter.ts";

const router = Router({mergeParams: true});
export default router

router.use("/classId/info", infoRouter);
router.use("/:classId/teachers", teachersRouter);
router.use("/:classId/students", studentsRouter);
router.use("/:classId/assignments", assignmentsRouter);
router.use("/:classId/conversations", conversationsRouter);

router.post("/", postClass);
router.get("/:classId", getClass);
router.delete("/:classId", deleteClass);