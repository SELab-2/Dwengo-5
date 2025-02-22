import {Request, Response, Router} from "express";

import wachtrij_router from "../klassen_router.ts"

const router = Router({mergeParams:true})
export default router

router.get("/", (req: Request, res: Response) => {
    res.status(501);
});

router.post("/", (req: Request, res: Response) => {
    res.status(501);
});

router.delete("/:leerling_id", (req: Request, res: Response) => {
    res.status(501);
});

router.patch("/:leerling_id", (req: Request, res: Response) => {
    res.status(501);
});