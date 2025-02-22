import {Request, Response, Router} from "express";

const router = Router({mergeParams: true})
export default router

router.get("/", (req: Request, res: Response) => {
    res.status(501);
});