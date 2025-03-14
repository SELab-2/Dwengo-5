import {Router} from "express";
import {klasConversaties} from "../../../controllers/classes/conversations/conversationsController.ts";

const router = Router({mergeParams: true});
export default router

router.get("/", klasConversaties);