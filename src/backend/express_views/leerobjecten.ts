import {Express, Request, Response} from "express";
import {JsonMdObject} from "../json_objecten.ts";

export function register_views(app: Express) {
    app.get("/leerobjecten/:o_id", (req: Request, res: Response) => {
        res.status(501);
        const o_id: number =  parseInt(req.params.o_id);
    });

    app.get("/leerobjecten/:o_id/inhoud", (req: Request, res: Response) => {
        res.status(501);
        const o_id: number =  parseInt(req.params.o_id);
        res.send(new JsonMdObject());
    });
}