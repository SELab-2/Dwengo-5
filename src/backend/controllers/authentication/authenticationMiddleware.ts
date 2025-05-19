import jwt, {JwtPayload} from "jsonwebtoken";
import {NextFunction, Request, Response} from "express";
import {JWT_SECRET} from "../../index.ts";
import {throwExpressException} from "../../exceptions/ExpressException.ts";
import {z} from "zod";

export function authenticate(req: Request, _res: Response, next: NextFunction) {
    try {
        const userId = z.coerce.number().safeParse(req.params.userId);
        if (!userId.success) return throwExpressException(400, "invalid userId", next);

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer "))
            return throwExpressException(401, "no token sent", next);
        const token = authHeader.slice(7); // cut "Bearer "
        let payload: JwtPayload;
        try {
            payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
        } catch (err: any) {
            if (err.name === "TokenExpiredError")
                return throwExpressException(401, "expired token", next);
            throw err;
        }

        if (!payload || typeof payload !== "object" || !payload.id)
            return throwExpressException(401, "invalid token", next);
        if (Number(payload.id) !== userId.data)
            return throwExpressException(401, "wrong token", next);

        next();
    } catch (e) {
        return throwExpressException(500, "" + e, next);
    }
}
