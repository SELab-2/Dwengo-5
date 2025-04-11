import {Router} from "express";
import {getWaitingroom, postWaitingroomUser} from "../../../controllers/classes/waitingroom/waitingroomController.ts";

const router = Router({mergeParams: true});
export default router;

router.post("/", getWaitingroom);