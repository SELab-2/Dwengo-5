import {Request, Response, Router} from "express";
import opdrachten_router from "./opdrachten/opdrachten_router.ts";
import {leerling_klassen} from "../../../controllers/leerlingen/klassen/klassen_controller.ts";

const router = Router({mergeParams:true})
export default router

router.use("/:klas_id/opdrachten", opdrachten_router)

router.get("/", leerling_klassen);
