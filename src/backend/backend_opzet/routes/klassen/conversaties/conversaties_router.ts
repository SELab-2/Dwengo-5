import {Router} from "express";
import {klas_conversaties} from "../../../controllers/klassen/conversaties/conversaties_controller.ts";

const router = Router({mergeParams: true});
export default router

router.get("/", klas_conversaties);