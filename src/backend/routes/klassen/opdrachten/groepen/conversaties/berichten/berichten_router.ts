import {Router} from "express";
import {
    conversatieBerichten,
    stuurInConversatie
} from "../../../../../../controllers/klassen/opdrachten/groepen/conversaties/berichten/berichten_controller.ts";

const router = Router({mergeParams: true});
export default router

router.get("/", conversatieBerichten);
router.post("/", stuurInConversatie);
