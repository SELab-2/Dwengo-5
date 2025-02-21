import {Express, Request, Response} from "express";

export function register_views(app: Express) {
    app.post("/klassen", (req: Request, res: Response) => {
        res.status(501);
    });

    app.get("/klassen/:k_id", (req: Request, res: Response) => {
        res.status(501);
    });

    app.delete("/klassen/:k_id", (req: Request, res: Response) => {
        res.status(501);
    });

    app.get("/klassen/:k_id/opdrachten", (req: Request, res: Response) => {
        res.status(501);
    });

    app.post("/klassen/:k_id/opdrachten", (req: Request, res: Response) => {
        res.status(501);
    });

    app.get("/klassen/:k_id/opdrachten/:o_id", (req: Request, res: Response) => {
        res.status(501);
    });

    app.delete("/klassen/:k_id/opdrachten/:o_id", (req: Request, res: Response) => {
        res.status(501);
    });

    app.get("/klassen/:k_id/opdrachten/:o_id/leerlingen", (req: Request, res: Response) => {
        res.status(501);
    });

    app.post("/klassen/:k_id/opdrachten/:o_id/leerlingen", (req: Request, res: Response) => {
        res.status(501);
    });

    app.get("/klassen/:k_id/opdrachten/:o_id/leerlingen/:l_id", (req: Request, res: Response) => {
        res.status(501);
    });

    app.delete("/klassen/:k_id/opdrachten/:o_id/leerlingen/:l_id", (req: Request, res: Response) => {
        res.status(501)
    });

    app.get("/klassen/:k_id/leerlingen", (req: Request, res: Response) => {
        res.status(501);
    });

    app.post("/klassen/:k_id/leerlingen", (req: Request, res: Response) => {
        res.status(501);
    });

    app.delete("/klassen/:k_id/leerlingen/:l_id", (req: Request, res: Response) => {
        res.status(501);
    });

    app.get("/klassen/:k_id/wachtrij", (req: Request, res: Response) => {
        res.status(501);
    });

    app.post("/klassen/:k_id/wachtrij", (req: Request, res: Response) => {
        res.status(501);
    });

    app.delete("/klassen/:k_id/wachtrij/:l_id", (req: Request, res: Response) => {
        res.status(501);
    });

    app.patch("/klassen/:k_id/wachtrij/:l_id", (req: Request, res: Response) => {
        res.status(501);
    });

    app.get("/klassen/:k_id/leerkrachten", (req: Request, res: Response) => {
        res.status(501);
    });

    app.post("/klassen/:k_id/leerkrachten", (req: Request, res: Response) => {
        res.status(501);
    });

    app.delete("/klassen/:k_id/leerkrachten/:l_id", (req: Request, res: Response) => {
        res.status(501);
    });

    app.patch("/klassen/:k_id/leerkrachten/:l_id", (req: Request, res: Response) => {
        res.status(501);
    });
}