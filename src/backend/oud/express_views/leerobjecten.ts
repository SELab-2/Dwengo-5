import {Express, Request, Response} from "express";
import {JsonMdObject} from "../json_objecten.ts";

export function register_views(app: Express) {
    app.get("/leerobjecten/:o_id", (req: Request, res: Response) => {
        res.status(501);
    });

    app.get("/leerobjecten/:o_id/inhoud", (req: Request, res: Response) => {
        res.send(new JsonMdObject());
        res.status(501);
    });
}