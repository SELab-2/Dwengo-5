import {Request, Response, Router} from "express";

const router = Router({mergeParams:true})
export default router

router.get("/", (req: Request, res: Response) => {
    res.status(501);
});

router.post("/", (req: Request, res: Response) => {
    res.status(501);
});

router.delete("/:klas_id", (req: Request, res: Response) => {
    res.status(501);
});

router.patch("/:klas_id", (req: Request, res: Response) => {
    res.status(501);
});