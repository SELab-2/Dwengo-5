import { Router } from "express";
import {
    deleteConversation,
    getConversation,
    getGroupConversations,
    postGroupConversation
} from "../../../../../controllers/classes/assignments/groups/conversations/conversationsController.ts";

import messagesRouter from "./messages/messagesRouter.ts";

const router = Router({ mergeParams: true });
export default router

router.use("/:conversationId/messages", messagesRouter);

router.get("/", getGroupConversations);
router.post("/", postGroupConversation);
router.get("/:conversationId", getConversation);
router.delete("/:conversationId", deleteConversation);