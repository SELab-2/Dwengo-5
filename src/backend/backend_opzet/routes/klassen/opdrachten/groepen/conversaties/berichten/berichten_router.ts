import {Router} from "express";
import {
    conversatieBerichten,
    stuur_in_conversatie
} from "../../../../../../controllers/klassen/opdrachten/groepen/conversaties/berichten/berichten_controller.ts";

const router = Router({mergeParams: true});
export default router

router.get("/:conversatie_id", conversatieBerichten);
router.patch("/:conversatie_id", stuur_in_conversatie);
