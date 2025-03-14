import {Router} from "express";
import {
    conversatieBerichten,
    stuurInConversatie
} from "../../../../../../controllers/classes/assignments/groups/conversations/messages/messagesController.ts";

const router = Router({mergeParams: true});
export default router

router.get("/", conversatieBerichten);
router.post("/", stuurInConversatie);
