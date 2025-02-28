import {Router} from "express";

import klassen_router from "./klassen/klassen_router.ts";
import {leerling, verwijder_leerling} from "../../controllers/leerlingen/leerlingen_controller.ts";

const router = Router({mergeParams: true})
export default router

router.use("/:leerling_id/klassen", klassen_router);

router.get("/:leerling_id", leerling);
router.delete("/:leerling_id", verwijder_leerling);