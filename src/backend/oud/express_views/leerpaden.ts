import {Express, Request, Response} from "express";

export function register_views(app: Express) {
    app.get("/", (req: Request, res: Response) => {
        res.send("api antwoordt");
    });

    app.get("/leerpaden/:taal", (req: Request, res: Response) => {
        res.status(501);
    });

    app.get("/leerpaden/:p_id", (req: Request, res: Response) => {
        res.status(501);
    });

    app.get("/leerpaden/:p_id/inhoud", (req: Request, res: Response) => {
        res.status(501);
    });
}