import { Router } from "express";
import { getClassConversations } from "../../../controllers/classes/conversations/conversationsController.ts";

const router = Router({ mergeParams: true });
export default router

router.get("/", getClassConversations);