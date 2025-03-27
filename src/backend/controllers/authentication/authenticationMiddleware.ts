import jwt, {JwtPayload} from "jsonwebtoken";
import {NextFunction, Request, Response} from "express";
import {JWT_SECRET} from "../../index.ts";
import {throwExpressException} from "../../exceptions/ExpressException.ts";
import {z} from "zod";

export function authenticate(type: "student" | "teacher") {
    return (req: Request, _res: Response, next: NextFunction): void => {
        const userId = z.coerce.number().safeParse(
            req.params[type == "student" ? "studentId" : "teacherId"]
        );
        if (!userId.success) return throwExpressException(400, "invalid userId", next);
    
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer "))
            return throwExpressException(401, "Geen token meegestuurd", next);
        const token = authHeader.slice(7); // afsnijden van "Bearer "
        const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;

        if (!payload || typeof payload !== "object" || !payload.id)
            return throwExpressException(401, "Ongeldig token", next);
        if (Number(payload.id) !== userId.data)
            return throwExpressException(401, "wrong token", next);

        next();
    };
}
