import {Router} from "express";
import {
    opdracht_leerlingen,
    opdracht_verwijder_leerling,
    opdracht_voeg_leerling_toe
} from "../../../../controllers/klassen/opdrachten/leerlingen/leerlingen_controller.ts";

const router = Router({mergeParams: true});
export default router

router.get("/", opdracht_leerlingen);
router.post("/:leerling_id", opdracht_voeg_leerling_toe);
router.delete("/:leerling_id", opdracht_verwijder_leerling);