import {Router} from "express";
import {
    getConversationMessages,
    postConversationMessage
} from "../../../../../../controllers/classes/assignments/groups/conversations/messages/messagesController.ts";

const router = Router({mergeParams: true});
export default router

router.get("/", getConversationMessages);
router.post("/", postConversationMessage);
