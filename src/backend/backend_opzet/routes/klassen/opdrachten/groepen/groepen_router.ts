import {Router} from "express";
import leerlingen_router from "./leerlingen/leerlingen_router.ts";
import vragen_router from "./vragen/vragen_router.ts";


const router = Router({mergeParams: true})
export default router

router.use("/:groep_id/leerlingen", leerlingen_router)
router.use("/:groep_id/vragen", leerlingen_router)

router.get("/",);
router.post("/",);
router.delete("/:groep_id",);