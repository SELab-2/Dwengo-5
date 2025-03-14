import {Router} from "express";
import {leerkrachtKlassen} from "../../../controllers/teachers/klassen/klassen_controller.ts";
import {authenticate} from "../../../controllers/authenticatie/authenticatie_controller_common.ts";

const router = Router({mergeParams: true});
export default router

router.get("/", (req, res, next) => {
    const leerkrachtId = Number(req.params.teacherstudentId);
    authenticate(leerkrachtId)(req, res, next);
}, leerkrachtKlassen);