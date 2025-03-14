import {Router} from "express";

import klassen_router from "./klassen/klassen_router.ts";
import {leerling, verwijderLeerling} from "../../controllers/students/leerlingen_controller.ts";
import {authenticate} from "../../controllers/authenticatie/authenticatie_controller_common.ts";

const router = Router({mergeParams: true});
export default router

router.use("/:studentId/klassen", klassen_router);

router.get("/:studentId", leerling);
router.delete("/:studentId", (req, res, next) => {
    const studentId = Number(req.params.studentId);
    authenticate(studentId)(req, res, next);
}, verwijderLeerling);