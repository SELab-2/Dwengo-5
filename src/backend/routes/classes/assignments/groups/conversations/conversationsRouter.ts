import {Router} from "express";
import {
    getConversation,
    getGroupConversations,
    postGroupConversation,
    deleteConversation
} from "../../../../../controllers/classes/assignments/groups/conversations/conversationsController.ts";
import berichten_router from "./messages/messagesRouter.ts";

const router = Router({mergeParams: true});
export default router

router.use("/:conversationId/messages", berichten_router);

router.get("/", getGroupConversations);
router.post("/", postGroupConversation);
router.get("/:conversationId", getConversation);
router.delete("/:conversationId", deleteConversation);