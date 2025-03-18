import {Router} from "express";
import {getTeacherClasses} from "../../../controllers/teachers/classes/classesController.ts";
import {authenticate} from "../../../controllers/authentication/authenticationMiddleware.ts";

const router = Router({mergeParams: true});
export default router

router.get("/", (req, res, next) => {
    const teacherId = Number(req.params.teacherstudentId);
    authenticate(teacherId)(req, res, next);
}, getTeacherClasses);