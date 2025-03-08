import {Router} from "express";
import klassen_router from "./klassen/klassen_router.ts";
import {leerkracht, verwijder_leerkracht,} from "../../controllers/leerkrachten/leerkrachten_controller.ts";
import {authenticate} from "../../controllers/authenticatie/authenticatie_controller_common.ts";

const router = Router({mergeParams: true});
export default router;

router.use("/:leerkracht_id/klassen", klassen_router);

router.get("/:leerkracht_id", leerkracht);

router.delete("/:leerkracht_id", (req, res, next) => {
    const leerkrachtId = Number(req.params.leerkracht_id);
    authenticate(leerkrachtId)(req, res, next);
}, verwijder_leerkracht);
