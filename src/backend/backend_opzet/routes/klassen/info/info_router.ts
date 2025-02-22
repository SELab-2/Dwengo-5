import {Router} from "express";
import {klas_info} from "../../../controllers/klassen/info/info_controller.ts";

const router = Router({mergeParams: true})
export default router

router.get("/:klas_id", klas_info);