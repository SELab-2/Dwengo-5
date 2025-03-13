import {Router} from "express";

import klassen_router from "./klassen/klassen_router.ts";
import {leerling, verwijderLeerling} from "../../controllers/leerlingen/leerlingen_controller.ts";
import {authenticate} from "../../controllers/authenticatie/authenticatie_controller_common.ts";

const router = Router({mergeParams: true});
export default router

router.use("/:leerling_id/klassen", klassen_router);

router.get("/:leerling_id", leerling);
router.delete("/:leerling_id", (req, res, next) => {
    const studentId = Number(req.params.leerling_id);
    authenticate(studentId)(req, res, next);
}, verwijderLeerling);