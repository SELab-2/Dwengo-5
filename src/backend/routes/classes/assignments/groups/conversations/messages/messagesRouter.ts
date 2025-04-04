import {Router} from "express";
import {
    deleteConversationMessage,
    getConversationMessage,
    getConversationMessages,
    postConversationMessage
} from "../../../../../../controllers/classes/assignments/groups/conversations/messages/messagesController.ts";

const router = Router({mergeParams: true});
export default router

router.get("/", getConversationMessages);
router.get("/:messageId", getConversationMessage);
router.post("/", postConversationMessage);
router.delete("/:messageId", deleteConversationMessage);
