import {Router} from "express";
import {
    leerling_conversaties,
} from "../../../../controllers/klassen/leerlingen/conversaties/conversaties_controller.ts";

const router = Router({mergeParams: true});
export default router

router.get("/", leerling_conversaties);