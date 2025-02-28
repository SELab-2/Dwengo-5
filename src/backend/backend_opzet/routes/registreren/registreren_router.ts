import {Router} from "express";
import {registreren_leerkracht, registreren_leerling} from "../../controllers/registreren/registreren_controller.ts";

const router = Router()
export default router

router.get("/leerlingen", registreren_leerling);
router.get("/leerkrachten", registreren_leerkracht);
