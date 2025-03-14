import {Router} from "express";
import {leerlingOpdrachten} from "../../../../controllers/students/classes/assignments/assignmentController.ts";
import {authenticate} from "../../../../controllers/authentication/commonAuthenticationController.ts";

const router = Router({mergeParams: true});
export default router

router.get("/", (req, res, next) => {
    const studentId = Number(req.params.studentId);
    authenticate(studentId)(req, res, next);
}, leerlingOpdrachten);