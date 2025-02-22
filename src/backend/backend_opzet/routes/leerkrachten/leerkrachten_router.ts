import {Request, Response, Router} from "express";
import {JsonLeerkrachtObject} from "../../json_objecten.ts";
import klassen_router from "./klassen/klassen_router.ts";

const router = Router({mergeParams:true})
export default router

router.use("/:leerkracht_id/klassen", klassen_router)

router.post("/", (req: Request, res: Response) => {
    res.send(new JsonLeerkrachtObject());
    res.status(501);
});

router.delete("/:leerkracht_id", (req: Request, res: Response) => {
    res.status(501);
});
