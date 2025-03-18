import {Router} from "express";
import {
    getAssignmentConversations
} from "../../../../controllers/classes/assignments/conversations/conversationsController.ts";

const router = Router({mergeParams: true});
export default router

router.get("/", getAssignmentConversations);