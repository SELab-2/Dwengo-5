import {Router} from "express";
import {leerkrachtKlassen} from "../../../controllers/teachers/classes/classesController.ts";
import {authenticate} from "../../../controllers/authentication/commonAuthenticationController.ts";

const router = Router({mergeParams: true});
export default router

router.get("/", (req, res, next) => {
    const leerkrachtId = Number(req.params.teacherstudentId);
    authenticate(leerkrachtId)(req, res, next);
}, leerkrachtKlassen);