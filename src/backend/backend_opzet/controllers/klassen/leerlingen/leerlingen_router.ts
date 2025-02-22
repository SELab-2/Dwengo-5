import {Request, Response, Router} from "express";
import vragen_router from "./vragen/vragen_router.ts";
import info_router from "./info/info_router.ts";

const router = Router({mergeParams:true})
export default router

router.use(vragen_router)
router.use(info_router)

router.get("/", (req: Request, res: Response) => {
    res.status(501);
});

router.post("/", (req: Request, res: Response) => {
    res.status(501);
});

router.delete("/:leerling_id", (req: Request, res: Response) => {
    res.status(501);
});