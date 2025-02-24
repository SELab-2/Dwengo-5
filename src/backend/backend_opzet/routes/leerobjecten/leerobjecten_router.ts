import {Router} from "express";
import {leerobject, leerobject_inhoud} from "../../controllers/leerobjecten/leerobjecten_controller.ts";

const router = Router({mergeParams: true})
export default router

router.get("/:leerobject_id", leerobject);
router.get("/:leerobject_id/inhoud", leerobject_inhoud);
