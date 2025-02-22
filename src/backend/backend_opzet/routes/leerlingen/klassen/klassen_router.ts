import {Request, Response, Router} from "express";
import opdrachten_router from "./opdrachten/opdrachten_router.ts";

const router = Router({mergeParams:true})
export default router

router.use("/:klas_id/opdrachten", opdrachten_router)

router.get("/", (req: Request, res: Response) => {
    res.status(501);
});