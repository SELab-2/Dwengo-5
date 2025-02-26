import {Router} from "express";

import {aanmelden_leerkracht, aanmelden_leerling} from "../../controllers/leerpaden/aanmelden_controller.ts";

const router = Router();
export default router;

router.post("/leerlingen", aanmelden_leerling);
router.post("/leerkrachten", aanmelden_leerkracht);
