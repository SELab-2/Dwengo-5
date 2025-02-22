import {Request, Response, Router} from "express";

const router = Router()
export default router

router.post("/klassen", (req: Request, res: Response) => {
    res.status(501);
});

router.get("/klassen/:k_id", (req: Request, res: Response) => {
    res.status(501);
});

router.delete("/klassen/:k_id", (req: Request, res: Response) => {
    res.status(501);
});

router.get("/klassen/:k_id/opdrachten", (req: Request, res: Response) => {
    res.status(501);
});

router.post("/klassen/:k_id/opdrachten", (req: Request, res: Response) => {
    res.status(501);
});

router.get("/klassen/:k_id/opdrachten/:o_id", (req: Request, res: Response) => {
    res.status(501);
});

router.delete("/klassen/:k_id/opdrachten/:o_id", (req: Request, res: Response) => {
    res.status(501);
});

router.get("/klassen/:k_id/opdrachten/:o_id/leerlingen", (req: Request, res: Response) => {
    res.status(501);
});

router.post("/klassen/:k_id/opdrachten/:o_id/leerlingen", (req: Request, res: Response) => {
    res.status(501);
});

router.get("/klassen/:k_id/opdrachten/:o_id/leerlingen/:l_id", (req: Request, res: Response) => {
    res.status(501);
});

router.delete("/klassen/:k_id/opdrachten/:o_id/leerlingen/:l_id", (req: Request, res: Response) => {
    res.status(501)
});

router.get("/klassen/:k_id/leerlingen", (req: Request, res: Response) => {
    res.status(501);
});

router.post("/klassen/:k_id/leerlingen", (req: Request, res: Response) => {
    res.status(501);
});

router.delete("/klassen/:k_id/leerlingen/:l_id", (req: Request, res: Response) => {
    res.status(501);
});

router.get("/klassen/:k_id/wachtrij", (req: Request, res: Response) => {
    res.status(501);
});

router.post("/klassen/:k_id/wachtrij", (req: Request, res: Response) => {
    res.status(501);
});

router.delete("/klassen/:k_id/wachtrij/:l_id", (req: Request, res: Response) => {
    res.status(501);
});

router.patch("/klassen/:k_id/wachtrij/:l_id", (req: Request, res: Response) => {
    res.status(501);
});

router.get("/klassen/:k_id/leerkrachten", (req: Request, res: Response) => {
    res.status(501);
});

router.post("/klassen/:k_id/leerkrachten", (req: Request, res: Response) => {
    res.status(501);
});

router.delete("/klassen/:k_id/leerkrachten/:l_id", (req: Request, res: Response) => {
    res.status(501);
});

router.patch("/klassen/:k_id/leerkrachten/:l_id", (req: Request, res: Response) => {
    res.status(501);
});

router.get("/klassen/:k_id/leerlingen/:l_id/vragen", (req: Request, res: Response) => {
    res.status(501);
});

router.post("/klassen/:k_id/leerlingen/:l_id/vragen", (req: Request, res: Response) => {
    res.status(501)
});

router.get("/klassen/:k_id/leerlingen/:l_id/vragen/:v_id", (req: Request, res: Response) => {
    res.status(501);
});

router.delete("/klassen/:k_id/leerlingen/:l_id/vragen/:v_id", (req: Request, res: Response) => {
    res.status(501);
});

router.patch("/klassen/:k_id/leerlingen/:l_id/vragen/:v_id", (req: Request, res: Response) => {
    res.status(501);
});

router.get("/klassen/:k_id/vragen", (req: Request, res: Response) => {
    res.status(501);
});

router.get("/klassen/$id/leerlingen/info", (req: Request, res: Response) => {
    res.status(501);
});

router.get("/klassen/$id/leerlingen/:l_id/info", (req: Request, res: Response) => {
    res.status(501);
});