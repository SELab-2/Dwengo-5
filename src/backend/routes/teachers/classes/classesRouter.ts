import {Router} from "express";
import {getClassTeachers} from "../../../controllers/teachers/classes/classesController.ts";
import {authenticate} from "../../../controllers/authentication/commonAuthenticationController.ts";

const router = Router({mergeParams: true});
export default router

router.get("/", (req, res, next) => {
    const leerkrachtId = Number(req.params.teacherstudentId);
    authenticate(leerkrachtId)(req, res, next);
}, getClassTeachers);