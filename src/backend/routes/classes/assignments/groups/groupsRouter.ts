import {Router} from "express";
import students_router from "./students/studentsRouter.ts";
import conversaties_router from "./conversations/conversationsRouter.ts";
import {
    getAssignmentGroups,
    postAssignmentGroup,
    deleteAssignmentGroup
} from "../../../../controllers/classes/assignments/groups/groupsController.ts";


const router = Router({mergeParams: true});
export default router

router.use("/:groupId/students", students_router);
router.use("/:groupId/conversations", conversaties_router);

router.get("/", getAssignmentGroups);
router.post("/", postAssignmentGroup);
router.delete("/:groupId", deleteAssignmentGroup);