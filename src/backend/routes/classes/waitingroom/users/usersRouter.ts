import {Router} from "express";
import {
    deleteWaitingroomUser,
    getWaitingroomUsers,
    postWaitingroomUser
} from "../../../../controllers/classes/waitingroom/waitingroomController.ts";

const router = Router({mergeParams: true});
export default router;

router.get("/", getWaitingroomUsers);
router.post('/', postWaitingroomUser);
router.patch('/:userId', postWaitingroomUser);
router.delete('/:userId', deleteWaitingroomUser);