import {Request, Response, Router} from "express";
import leerlingen_router from "./leerlingen/leerlingen_router.ts";

const router = Router({mergeParams:true})
export default router

router.use("/:opdracht_id/leerlingen", leerlingen_router)

router.get("/", (req: Request, res: Response) => {
    res.status(501);
});

router.post("/", (req: Request, res: Response) => {
    res.status(501);
});

router.get("/:opdracht_id", (req: Request, res: Response) => {
    res.status(501);
});

router.delete("/:opdracht_id", (req: Request, res: Response) => {
    res.status(501);
});