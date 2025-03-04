import {Router} from "express";

import info_router from "./info/info_router.ts";
import leerkrachten_router from "./leerkrachten/leerkrachten_router.ts";
import leerlingen_router from "./leerlingen/leerlingen_router.ts";
import opdrachten_router from "./opdrachten/opdrachten_router.ts";
import conversaties_router from "./conversaties/conversaties_router.ts";
import wachtrij_router from "./wachtrij/wachtrij_router.ts";
import {klas, maak_klas, verwijder_klas} from "../../controllers/klassen/klassen_controller.ts";

const router = Router({mergeParams: true});
export default router

router.use("/klas_id/info", info_router);
router.use("/:klas_id/leerkrachten", leerkrachten_router);
router.use("/:klas_id/leerlingen", leerlingen_router);
router.use("/:klas_id/opdrachten", opdrachten_router);
router.use("/:klas_id/conversaties", conversaties_router);
router.use("/:klas_id/wachtrij", wachtrij_router);

router.post("/", maak_klas);
router.get("/:klas_id", klas);
router.delete("/:klas_id", verwijder_klas);