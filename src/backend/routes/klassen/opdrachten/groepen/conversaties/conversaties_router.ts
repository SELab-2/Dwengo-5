import {Router} from "express";
import {
    conversatie,
    groepConversaties,
    groepMaakConversatie,
    verwijderConversatie
} from "../../../../../controllers/klassen/opdrachten/groepen/conversaties/conversaties_controller.ts";
import berichten_router from "./berichten/berichten_router.ts";

const router = Router({mergeParams: true});
export default router

router.use("/:conversationId/berichten", berichten_router);

router.get("/", groepConversaties);
router.post("/", groepMaakConversatie);
router.get("/:conversationId", conversatie);
router.delete("/:conversationId", verwijderConversatie);