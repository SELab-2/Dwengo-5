import { Router } from "express";
import { getWaitingroom } from "../../../controllers/classes/waitingroom/waitingroomController.ts";
import usersRouter from "./users/usersRouter.ts";

const router = Router({ mergeParams: true });
export default router;

router.use("/users", usersRouter);

router.get("/", getWaitingroom);
