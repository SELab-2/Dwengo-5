import {Request, Response, Router} from "express";
import {JsonLeerlingObject} from "../json_objecten.ts";

const router = Router()
export default router

router.post("/leerlingen", (req: Request, res: Response) => {
    res.status(501);
});

router.get("/leerlingen/:l_id", (req: Request, res: Response) => {
    res.send(new JsonLeerlingObject());
    res.status(501);
});

router.delete("/leerlingen/:l_id", (req: Request, res: Response) => {
    res.status(501);
});

router.get("/leerlingen/:l_id/klassen", (req: Request, res: Response) => {
    res.status(501);
});

router.get("/leerlingen/:l_id/klassen/:k_id/opdrachten", (req: Request, res: Response) => {
    res.status(501);
});
