import {Router} from "express";

import info_router from "./info/infoRouter.ts";
import teachers_router from "./teachers/teachersRouter.ts";
import students_router from "./students/studentsRouter.ts";
import opdrachten_router from "./assignments/assingmentsRouter.ts";
import conversaties_router from "./conversations/conversationsRouter.ts";
import {getClass, postClass, deleteClass} from "../../controllers/classes/classesController.ts";

const router = Router({mergeParams: true});
export default router

router.use("/classId/info", info_router);
router.use("/:classId/teachers", teachers_router);
router.use("/:classId/students", students_router);
router.use("/:classId/assignments", opdrachten_router);
router.use("/:classId/conversations", conversaties_router);

router.post("/", postClass);
router.get("/:classId", getClass);
router.delete("/:classId", deleteClass);