import {Router} from "express";
import {
    conversatie,
    groep_conversaties,
    groep_maak_conversatie,
    verwijder_conversatie
} from "../../../../../controllers/klassen/opdrachten/groepen/conversaties/conversaties_controller.ts";
import berichten_router from "./berichten/berichten_router.ts";

const router = Router({mergeParams: true})
export default router

router.use("/:coversatie_id/berichten", berichten_router);

router.get("/", groep_conversaties);
router.post("/", groep_maak_conversatie);
router.get("/:conversatie_id", conversatie);
router.delete("/:conversatie_id", verwijder_conversatie);