import {Express, Request, Response} from "express";
import {JsonLeerkrachtObject} from "../json_objecten.ts";

export function register_views(app: Express) {
    app.post("/leerkrachten", (req: Request, res: Response) => {
        res.send(new JsonLeerkrachtObject());
        res.status(501);
    });

    app.delete("leerkrachten/:l_id", (req: Request, res: Response) => {
        res.status(501);
    });

    app.get("/leerkrachten/:l_id/klassen", (req: Request, res: Response) => {
        res.status(501);
    });
}