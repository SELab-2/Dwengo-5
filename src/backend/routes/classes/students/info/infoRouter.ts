import {Router} from "express";
import {leerling_info} from "../../../../controllers/classes/students/info/infoController.ts";

const router = Router({mergeParams: true});
export default router

router.get("/", leerling_info);