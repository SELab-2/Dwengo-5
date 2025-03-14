import {Router} from "express";
import {leerlingOpdrachten} from "../../../../controllers/students/klassen/opdrachten/opdrachten_controller.ts";
import {authenticate} from "../../../../controllers/authenticatie/authenticatie_controller_common.ts";

const router = Router({mergeParams: true});
export default router

router.get("/", (req, res, next) => {
    const studentId = Number(req.params.studentId);
    authenticate(studentId)(req, res, next);
}, leerlingOpdrachten);