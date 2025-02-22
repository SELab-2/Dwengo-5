import {Request, Response, Router} from "express";

const router = Router()
export default router

router.get("/", (req: Request, res: Response) => {
    res.send("api antwoordt");
});

router.get("/leerpaden/:taal", (req: Request, res: Response) => {
    res.status(501);
});

router.get("/leerpaden/:p_id", (req: Request, res: Response) => {
    res.status(501);
});

router.get("/leerpaden/:p_id/inhoud", (req: Request, res: Response) => {
    res.status(501);
});
