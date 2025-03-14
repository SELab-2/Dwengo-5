import {Router} from "express";

import info_router from "./info/info_router.ts";
import leerkrachten_router from "./leerkrachten/leerkrachten_router.ts";
import leerlingen_router from "./leerlingen/leerlingen_router.ts";
import opdrachten_router from "./opdrachten/opdrachten_router.ts";
import conversaties_router from "./conversaties/conversaties_router.ts";
import {klas, maakKlas, verwijderKlas} from "../../controllers/klassen/klassen_controller.ts";

const router = Router({mergeParams: true});
export default router

router.use("/classId/info", info_router);
router.use("/:classId/teachers", leerkrachten_router);
router.use("/:classId/students", leerlingen_router);
router.use("/:classId/opdrachten", opdrachten_router);
router.use("/:classId/conversaties", conversaties_router);

router.post("/", maakKlas);
router.get("/:classId", klas);
router.delete("/:classId", verwijderKlas);