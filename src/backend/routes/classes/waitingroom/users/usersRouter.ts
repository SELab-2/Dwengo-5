import { Router } from "express";
import {
    deleteWaitingroomUser,
    getWaitingroomUsers, patchWaitingroomUser,
    postWaitingroomUser
} from "../../../../controllers/classes/waitingroom/waitingroomController.ts";

const router = Router({ mergeParams: true });
export default router;

router.get("/", getWaitingroomUsers);
router.post('/', postWaitingroomUser);
router.patch('/:userId', patchWaitingroomUser);
router.delete('/:userId', deleteWaitingroomUser);