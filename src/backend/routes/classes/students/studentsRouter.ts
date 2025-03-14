import {Router} from "express";
import info_router from "./info/infoRouter.ts";
import conversaties_router from "./conversaties/conversationsRouter.ts";
import {
    getClassStudents,
    postClassStudent,
    deleteClassStudent
} from "../../../controllers/classes/students/studentsController.ts";

const router = Router({mergeParams: true});
export default router

router.use("/info", info_router);
router.use("/:studentId/conversations", conversaties_router);

router.get("/", getClassStudents);
router.post("/", postClassStudent);

function ignoreReturn<T extends (...args: any[]) => any>(fn: T): (...args: Parameters<T>) => void {
    return (...args: Parameters<T>) => {
        fn(...args);
    };
}

router.delete("/:studentId", ignoreReturn(deleteClassStudent));