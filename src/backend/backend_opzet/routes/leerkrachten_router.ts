import {Request, Response, Router} from "express";
import {JsonLeerkrachtObject} from "../json_objecten.ts";

const router = Router()
export default router

router.post("/leerkrachten", (req: Request, res: Response) => {
    res.send(new JsonLeerkrachtObject());
    res.status(501);
});

router.delete("leerkrachten/:l_id", (req: Request, res: Response) => {
    res.status(501);
});

router.get("/leerkrachten/:l_id/klassen", (req: Request, res: Response) => {
    res.status(501);
});
