import {Router} from "express";
import leerlingen_router from "./leerlingen/leerlingen_router.ts";
import groepen_router from "./groepen/groepen_router.ts";
import {
    klas_opdracht,
    klas_opdrachten,
    maak_opdracht,
    verwijder_opdracht
} from "../../../controllers/klassen/opdrachten/opdrachten_controller.ts";

const router = Router({mergeParams: true})
export default router

router.use("/:opdracht_id/leerlingen", leerlingen_router)
router.use("/:opdracht_id/groepen", groepen_router)

router.get("/", klas_opdrachten);
router.post("/", maak_opdracht);
router.get("/:opdracht_id", klas_opdracht);
router.delete("/:opdracht_id", verwijder_opdracht);