import {Express, Request, Response} from "express";

export function register_views(app: Express) {
    app.get("/:inp", (req: Request, res: Response) => {
        const inp :string = req.params.inp;
        res.send(""+parseInt(inp));
    });

    app.get("/leerpaden/:taal", (req: Request, res: Response) => {
        res.status(501);
        const taal: string = req.params.taal;
    });

    app.get("/leerpaden/:p_id", (req: Request, res: Response) => {
        res.status(501);
        const p_id: number =  parseInt(req.params.p_id);
    });

    app.get("/leerpaden/:p_id/inhoud", (req: Request, res: Response) => {
        res.status(501);
        const p_id: number =  parseInt(req.params.p_id);
    });
}