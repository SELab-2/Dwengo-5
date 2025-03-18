import {Router} from "express";
import {klas_info} from "../../../controllers/classes/info/infoController.ts";

const router = Router({mergeParams: true});
export default router

router.get("/:classId", klas_info);