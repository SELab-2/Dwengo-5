import {Router} from "express";
import opdrachten_router from "./opdrachten/opdrachten_router.ts";
import {leerlingKlassen} from "../../../controllers/leerlingen/klassen/klassen_controller.ts";
import {authenticate} from "../../../controllers/authenticatie/authenticatie_controller_common.ts";

const router = Router({mergeParams: true});
export default router

router.use("/:klas_id/opdrachten", opdrachten_router);
/*
router.get("/", (req, res, next) => {
    const studentId = Number(req.params.leerling_id);
    authenticate(studentId)(req, res, next);
}, leerlingKlassen);*/
router.get("/", leerlingKlassen);
