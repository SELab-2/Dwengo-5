import {Router} from "express";
import {leerling_info} from "../../../../controllers/klassen/leerlingen/info/info_controller.ts";

const router = Router({mergeParams: true});
export default router

router.get("/", leerling_info);