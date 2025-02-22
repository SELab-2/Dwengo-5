import {Request, Response, Router} from "express";

import info_router from "./info/info_router.ts";
import leerkrachten_router from "./leerkrachten/leerkrachten_router.ts";
import leerlingen_router from "./leerlingen/leerlingen_router.ts";
import opdrachten_router from "./opdrachten/opdrachten_router.ts";
import vragen_router from "./vragen/vragen_router.ts";
import wachtrij_router from "./wachtrij/wachtrij_router.ts";

const router = Router({mergeParams:true})
export default router

router.use("/klas_id/info", info_router)
router.use("/:klas_id/leerkrachten", leerkrachten_router)
router.use("/:klas_id/leerlingen", leerlingen_router)
router.use("/:klas_id/opdrachten", opdrachten_router)
router.use("/:klas_id/vragen", vragen_router)
router.use("/:klas_id/wachtrij", wachtrij_router)

router.post("/", (req: Request, res: Response) => {
    res.status(501);
});

router.get("/:klas_id", (req: Request, res: Response) => {
    res.status(501);
});

router.delete("/:klas_id", (req: Request, res: Response) => {
    res.status(501);
});