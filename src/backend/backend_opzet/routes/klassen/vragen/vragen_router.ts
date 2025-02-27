import {Request, Response, Router} from "express";
import {klas_vragen} from "../../../controllers/klassen/vragen/vragen_controller.ts";

const router = Router({mergeParams:true})
export default router

router.get("/", klas_vragen);