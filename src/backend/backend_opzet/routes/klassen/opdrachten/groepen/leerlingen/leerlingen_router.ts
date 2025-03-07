import {Router} from "express";
import {
    groep_leerlingen,
    groep_verwijder_leerling,
    groep_voeg_leerling_toe
} from "../../../../../controllers/klassen/opdrachten/groepen/leerlingen/leerlingen_controller.ts";

const router = Router({mergeParams: true});
export default router

router.get("/", groep_leerlingen);
router.post("/", groep_voeg_leerling_toe);
router.delete("/:leerling_id", groep_verwijder_leerling);
