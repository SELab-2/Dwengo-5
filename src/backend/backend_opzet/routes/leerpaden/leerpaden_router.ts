import {Router} from "express";
import {leerpad, leerpadInhoud, leerpaden} from "../../controllers/leerpaden/leerpaden_controller.ts";

const router = Router({mergeParams: true});
export default router

router.get("/", leerpaden);
router.get("/:leerpad_id", leerpad);
router.get("/:leerpad_id/inhoud", leerpadInhoud);
