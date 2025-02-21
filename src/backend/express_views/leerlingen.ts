import {Express, Request, Response} from "express";
import {JsonLeerlingObject} from "../json_objecten.ts";

export function register_views(app: Express) {
    app.post("/leerlingen", (req: Request, res: Response) => {
        res.status(501);
        let leerlingen: JsonLeerlingObject[] = [];
        res.send(leerlingen)
    });

    app.get("/leerlingen/:l_id", (req: Request, res: Response) => {
        res.status(501);
        res.send(new JsonLeerlingObject());
    });

    app.delete("/leerlingen/:l_id", (req: Request, res: Response) => {

        res.status(501);
    });

    app.get("/leerlingen/:l_id/klassen", (req: Request, res: Response) => {
        res.status(501);
    });

    app.get("/leerlingen/:l_id/klassen/:k_id/opdrachten", (req: Request, res: Response) => {
        res.status(501);
    });
}