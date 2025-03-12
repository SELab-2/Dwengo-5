import {Router} from "express";
import {
    leerlingConversaties,
} from "../../../../controllers/klassen/leerlingen/conversaties/conversaties_controller.ts";
import {authenticate} from "../../../../controllers/authenticatie/authenticatie_controller_common.ts";

const router = Router({mergeParams: true});
export default router

router.get("/", leerlingConversaties);