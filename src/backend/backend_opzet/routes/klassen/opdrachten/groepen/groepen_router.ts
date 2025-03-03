import {Router} from "express";
import leerlingen_router from "./leerlingen/leerlingen_router.ts";
import conversaties_router from "./conversaties/conversaties_router.ts";
import {
    opdracht_maak_groep,
    opdracht_groepen, opdracht_verwijder_groep
} from "../../../../controllers/klassen/opdrachten/groepen/groepen_controller.ts";


const router = Router({mergeParams: true})
export default router

router.use("/:groep_id/leerlingen", leerlingen_router)
router.use("/:groep_id/conversaties", conversaties_router)

router.get("/",opdracht_groepen);
router.post("/",opdracht_maak_groep);
router.delete("/:groep_id",opdracht_verwijder_groep);