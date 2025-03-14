import {Router} from "express";
import klassen_router from "./classes/classesRouter.ts";
import {leerkracht, verwijderLeerkracht,} from "../../controllers/teachers/teachersController.ts";
import {authenticate} from "../../controllers/authentication/commonAuthenticationController.ts";

const router = Router({mergeParams: true});
export default router;

router.use("/:teacherstudentId/classes", klassen_router);

router.get("/:teacherstudentId", leerkracht);

router.delete("/:teacherstudentId", (req, res, next) => {
    const leerkrachtId = Number(req.params.teacherstudentId);
    authenticate(leerkrachtId)(req, res, next);
}, verwijderLeerkracht);
