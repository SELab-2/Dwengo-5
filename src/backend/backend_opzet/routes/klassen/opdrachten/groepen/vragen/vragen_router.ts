import {Router} from "express";
import {groep_vragen} from "../../../../../controllers/klassen/opdrachten/groepen/vragen/vragen_controller.ts";

const router = Router({mergeParams: true})
export default router

router.get("/",groep_vragen);
