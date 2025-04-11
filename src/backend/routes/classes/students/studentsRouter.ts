import {Router} from "express";
import {
    deleteClassStudent,
    getClassStudents
} from "../../../controllers/classes/students/studentsController.ts";

import infoRouter from "./info/infoRouter.ts";
import conversationsRouter from "./conversations/conversationsRouter.ts";

const router = Router({mergeParams: true});
export default router

router.use("/info", infoRouter);
router.use("/:studentId/conversations", conversationsRouter);

router.get("/", getClassStudents);

function ignoreReturn<T extends (...args: any[]) => any>(fn: T): (...args: Parameters<T>) => void {
    return (...args: Parameters<T>) => {
        fn(...args);
    };
}

router.delete("/:studentId", ignoreReturn(deleteClassStudent));
