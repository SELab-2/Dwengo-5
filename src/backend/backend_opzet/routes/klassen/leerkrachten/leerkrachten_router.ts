import {Router} from "express";
import {
    klas_leerkrachten,
    klas_verwijder_leerkracht,
    voeg_leerkracht_toe
} from "../../../controllers/klassen/leerkrachten/leerkrachten_controller.ts";

const router = Router({mergeParams: true});
export default router

router.get("/", klas_leerkrachten);
router.post("/", voeg_leerkracht_toe);
router.delete("/:leerkracht_id", klas_verwijder_leerkracht);