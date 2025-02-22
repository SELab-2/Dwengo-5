import {Request, Response, Router} from "express";
import {JsonMdObject} from "../../json_objecten.ts";

const router = Router({mergeParams:true})
export default router

router.get("/:leerobject_id", (req: Request, res: Response) => {
    res.status(501);
});

router.get("/:leerobject_id/inhoud", (req: Request, res: Response) => {
    res.send(new JsonMdObject());
    res.status(501);
});
