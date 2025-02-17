import {Express, Request, Response} from "express";

export function register_views(app: Express) {
    //todo: wat met vragen
    app.get("/klassen/:k_id/leerlingen/:l_id/vragen", (req: Request, res: Response) => {
        res.status(501);
    });

    app.post("/klassen/:k_id/leerlingen/:l_id/vragen", (req: Request, res: Response) => {
        res.status(501)
    });

    app.get("/klassen/:k_id/leerlingen/:l_id/vragen/:v_id", (req: Request, res: Response) => {
        res.status(501);
    });

    app.delete("/klassen/:k_id/leerlingen/:l_id/vragen/:v_id", (req: Request, res: Response) => {
        res.status(501);
    });

    app.patch("/klassen/:k_id/leerlingen/:l_id/vragen/:v_id", (req: Request, res: Response) => {
        res.status(501);
    });

    app.get("/klassen/:k_id/vragen", (req: Request, res: Response) => {
        res.status(501);
    });}