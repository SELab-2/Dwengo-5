import {Request, Response, Router} from "express";
import {JsonLeerlingObject} from "../../json_objecten.ts";

import klassen_router from "./klassen/klassen_router.ts";

const router = Router({mergeParams:true})
export default router

router.use("/:leerling_id/klassen", klassen_router);

router.post("/leerlingen", (req: Request, res: Response) => {
    res.status(501);
});

router.get("/:leerling_id", (req: Request, res: Response) => {
    res.send(new JsonLeerlingObject());
    res.status(501);
});

router.delete("/:leerling_id", (req: Request, res: Response) => {
    res.status(501);
});
