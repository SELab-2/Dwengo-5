import {Request, Response, Router} from "express";
import {JsonMdObject} from "../json_objecten.ts";

const router = Router()
export default router

router.get("/leerobjecten/:o_id", (req: Request, res: Response) => {
    res.status(501);
});

router.get("/leerobjecten/:o_id/inhoud", (req: Request, res: Response) => {
    res.send(new JsonMdObject());
    res.status(501);
});
