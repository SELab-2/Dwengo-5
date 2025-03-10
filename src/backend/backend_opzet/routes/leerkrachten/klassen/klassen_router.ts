import {Router} from "express";
import {leerkracht_klassen} from "../../../controllers/leerkrachten/klassen/klassen_controller.ts";
import {authenticate} from "../../../controllers/authenticatie/authenticatie_controller_common.ts";

const router = Router({mergeParams: true});
export default router

router.get("/", (req, res, next) => {
    console.log("IK WORD OPGEROEPEN")
    const leerkrachtId = Number(req.params.leerkracht_id);
    authenticate(leerkrachtId)(req, res, next);
}, leerkracht_klassen);