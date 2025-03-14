import {Router} from "express";
import {
    opdrachtConversaties
} from "../../../../controllers/classes/assignments/conversations/conversationsController.ts";

const router = Router({mergeParams: true});
export default router

router.get("/", opdrachtConversaties);