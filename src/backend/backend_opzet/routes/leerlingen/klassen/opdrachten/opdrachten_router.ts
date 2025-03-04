import {Router} from "express";
import {leerling_opdrachten} from "../../../../controllers/leerlingen/klassen/opdrachten/opdrachten_controller.ts";

const router = Router({mergeParams: true});
export default router

router.get("/", leerling_opdrachten);