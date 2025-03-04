import {Router} from "express";
import {leerkracht_klassen} from "../../../controllers/leerkrachten/klassen/klassen_controller.ts";

const router = Router({mergeParams: true});
export default router

router.get("/", leerkracht_klassen);