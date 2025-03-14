import {Router} from "express";
import opdrachten_router from "./opdrachten/opdrachten_router.ts";
import {leerlingKlassen} from "../../../controllers/students/klassen/klassen_controller.ts";
import {authenticate} from "../../../controllers/authenticatie/authenticatie_controller_common.ts";

const router = Router({mergeParams: true});
export default router

router.use("/:classId/opdrachten", opdrachten_router);

router.get("/", (req, res, next) => {
    const studentId = Number(req.params.studentId);
    authenticate(studentId)(req, res, next);
}, leerlingKlassen);
