import {Router} from "express";
import {getTeacherClasses} from "../../../controllers/teachers/classes/classesController.ts";
import {authenticate} from "../../../controllers/authentication/authenticationMiddleware.ts";

const router = Router({mergeParams: true});
export default router

router.get("/",
    authenticate("teacher"),
    getTeacherClasses);