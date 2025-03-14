import {Router} from "express";
import leerlingen_router from "./students/studentsRouter.ts";
import groepen_router from "./groups/groupsRouter.ts";
import conversaties_router from "./conversations/conversationsRouter.ts";
import {
    getClassAssignment,
    getClassAssignments,
    postClassAssignment,
    deleteClassAssignment
} from "../../../controllers/classes/assignments/assignmentsController.ts";

const router = Router({mergeParams: true});
export default router

router.use("/:assignmentId/students", leerlingen_router);
router.use("/:assignmentId/groups", groepen_router);
router.use("/:assignmentId/conversations", conversaties_router);

router.get("/", getClassAssignments);
router.post("/", postClassAssignment);
router.get("/:assignmentId", getClassAssignment);
router.delete("/:assignmentId", deleteClassAssignment);