import {Router} from "express";
import {deleteClass, getClass, patchClass, postClass} from "../../controllers/classes/classesController.ts";

import infoRouter from "./info/infoRouter.ts";
import teachersRouter from "./teachers/teachersRouter.ts";
import studentsRouter from "./students/studentsRouter.ts";
import assignmentsRouter from "./assignments/assingmentsRouter.ts";
import conversationsRouter from "./conversations/conversationsRouter.ts";
import waitingroomRouter from "./waitingroom/waitingroomRouter.ts";

const router = Router({mergeParams: true});
export default router

router.use("/classId/info", infoRouter);
router.use("/:classId/students", studentsRouter);
router.use("/:classId/teachers", teachersRouter);
router.use("/:classId/assignments", assignmentsRouter);
router.use("/:classId/conversations", conversationsRouter);
router.use("/:classId/waitingroom", waitingroomRouter);

router.post("/", postClass);
router.get("/:classId", getClass);
router.delete("/:classId", deleteClass);
router.patch("/:classId", patchClass);