import {Router} from "express";
import leerlingen_router from "./leerlingen/leerlingen_router.ts";
import groepen_router from "./groepen/groepen_router.ts";
import conversaties_router from "./conversaties/conversaties_router.ts";
import {
    klasOpdracht,
    klasOpdrachten,
    maakOpdracht,
    verwijderOpdracht
} from "../../../controllers/klassen/opdrachten/opdrachten_controller.ts";

const router = Router({mergeParams: true});
export default router

router.use("/:opdracht_id/leerlingen", leerlingen_router);
router.use("/:opdracht_id/groepen", groepen_router);
router.use("/:opdracht_id/conversaties", conversaties_router);

router.get("/", klasOpdrachten);
router.post("/", maakOpdracht);
router.get("/:opdracht_id", klasOpdracht);
router.delete("/:opdracht_id", verwijderOpdracht);