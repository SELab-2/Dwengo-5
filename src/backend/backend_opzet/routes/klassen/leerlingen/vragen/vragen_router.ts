import {Router} from "express";
import {
    beantwoord_vraag,
    leerling_vragen,
    vraag,
    vraag_aanmaken,
    vraag_verwijder
} from "../../../../controllers/klassen/leerlingen/vragen/vragen_controller.ts";

const router = Router({mergeParams: true})
export default router

router.get("/", leerling_vragen);
router.post("/", vraag_aanmaken);
router.get("/:vraag_id", vraag);
router.delete("/:vraag_id", vraag_verwijder);
router.patch("/:vraag_id", beantwoord_vraag);