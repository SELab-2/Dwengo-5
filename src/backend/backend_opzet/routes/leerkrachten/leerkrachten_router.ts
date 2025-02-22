import {Router} from "express";
import klassen_router from "./klassen/klassen_router.ts";
import {maak_leerkracht, verwijder_leerkracht} from "../../controllers/leerkrachten/leerkrachten_controller.ts";

const router = Router({mergeParams: true})
export default router

router.use("/:leerkracht_id/klassen", klassen_router)

router.post("/", maak_leerkracht);
router.delete("/:leerkracht_id", verwijder_leerkracht);
