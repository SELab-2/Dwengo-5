import {Router} from "express";
import teachersRouter from "./teachers/teachersRouter.ts";
import studentsRouter from "./students/studentsRouter.ts";
import {getWaitingroom} from "../../../controllers/classes/waitingroom/waitingroomController.ts";

const router = Router({mergeParams: true});
export default router

router.use("/teachers", teachersRouter);
router.use("/students", studentsRouter);

router.get("/", getWaitingroom);