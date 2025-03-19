import {Router} from "express";
import {deleteTeacher, getTeacher,} from "../../controllers/teachers/teachersController.ts";
import {authenticate} from "../../controllers/authentication/authenticationMiddleware.ts";
import classesRouter from "./classes/classesRouter.ts";

const router = Router({mergeParams: true});
export default router;

router.use("/:teacherstudentId/classes", classesRouter);

router.get("/:teacherstudentId", getTeacher);

router.delete("/:teacherstudentId",
    authenticate("teacher"),
    deleteTeacher);
