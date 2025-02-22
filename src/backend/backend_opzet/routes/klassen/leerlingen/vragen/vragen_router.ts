import {Request, Response, Router} from "express";

const router = Router({mergeParams:true})
export default router

router.get("/:leerling_id/vragen", (req: Request, res: Response) => {
    res.status(501);
});

router.post("/:leerling_id/vragen", (req: Request, res: Response) => {
    res.status(501)
});

router.get("/:leerling_id/vragen/:vraag_id", (req: Request, res: Response) => {
    res.status(501);
});

router.delete("/:leerling_id/vragen/:vraag_id", (req: Request, res: Response) => {
    res.status(501);
});

router.patch("/::leerling_id/vragen/:vraag_id", (req: Request, res: Response) => {
    res.status(501);
});