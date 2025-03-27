import {Router} from "express";

import {
    deleteWaitingroomTeacher,
    getWaitingroomTeachers,
    patchWaitingroomTeacher,
    postWaitingroomTeacher
} from "../../../../controllers/classes/waitingroom/teachers/teachersController.ts";

const router = Router({mergeParams: true});
export default router

router.get("/", getWaitingroomTeachers);
router.post("/", postWaitingroomTeacher);
router.patch("/:teacherId", patchWaitingroomTeacher);
router.delete("/:teacherId", deleteWaitingroomTeacher);
