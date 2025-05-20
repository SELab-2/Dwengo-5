import { Router } from "express";
import {
    getStudentConversations
} from "../../../../controllers/classes/students/conversations/conversationsController.ts";

const router = Router({ mergeParams: true });
export default router

router.get("/", getStudentConversations);