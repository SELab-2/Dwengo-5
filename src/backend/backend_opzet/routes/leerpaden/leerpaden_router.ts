import {Request, Response, Router} from "express";

const router = Router({mergeParams:true})
export default router

router.get("/:taal", (req: Request, res: Response) => {
    res.status(501);
});

router.get("/:leerpad_id", (req: Request, res: Response) => {
    res.status(501);
});

router.get("/leerpad_id/inhoud", (req: Request, res: Response) => {
    res.status(501);
});
