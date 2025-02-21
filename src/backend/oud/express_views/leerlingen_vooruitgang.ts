import {Express, Request, Response} from "express";

export function register_views(app: Express) {
    app.get("/klassen/$id/leerlingen/info", (req: Request, res: Response) => {
        res.status(501);
    });

    app.get("/klassen/$id/leerlingen/:l_id/info", (req: Request, res: Response) => {
        res.status(501);
    });
}