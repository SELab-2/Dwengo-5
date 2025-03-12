import {Router} from "express";
import leerlingen_router from "./leerlingen/leerlingen_router.ts";
import conversaties_router from "./conversaties/conversaties_router.ts";
import {
    opdrachtGroepen,
    opdrachtMaakGroep,
    opdrachtVerwijderGroep
} from "../../../../controllers/klassen/opdrachten/groepen/groepen_controller.ts";


const router = Router({mergeParams: true});
export default router

router.use("/:groep_id/leerlingen", leerlingen_router);
router.use("/:groep_id/conversaties", conversaties_router);

router.get("/", opdrachtGroepen);
router.post("/", opdrachtMaakGroep);
router.delete("/:groep_id", opdrachtVerwijderGroep);