import {Express, Request, Response} from "express";
import {JsonLeerkrachtObject} from "../json_objecten.ts";

export function register_views(app: Express) {
    app.post("/leerkrachten", (req: Request, res: Response) => {
        res.status(501);
        const leerkrachten:JsonLeerkrachtObject[] = [];
        res.send(leerkrachten);
    });

    app.delete("leerkrachten/:l_id", (req: Request, res: Response) => {
        res.status(501);
        const l_id: number =  parseInt(req.params.l_id);
    });

    app.get("/leerkrachten/:l_id/klassen", (req: Request, res: Response) => {
        const l_id: number =  parseInt(req.params.l_id);
        res.status(501);
    });
}