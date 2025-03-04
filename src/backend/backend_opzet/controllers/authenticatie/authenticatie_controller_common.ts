import { z } from "zod";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import {JWT_SECRET} from "../../index.ts";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export function authenticate(expectedId?: number) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "Geen token meegestuurd" });
        return;
      }
      const token = authHeader.slice(7); // afsnijden van "Bearer "
      const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;

      // TODO: test error handling bij ongebruikte token

      if (!payload || typeof payload !== "object" || !payload.id) {
        res.status(401).json({ error: "Ongeldige token" });
        return;
      }
      if (expectedId && Number(payload.id) !== expectedId) {
        res.status(401).json({
          error:
            "Niet geauthoriseerd: id uit JWT komt niet overeen met opgevraagde",
        });
        return;
      }

      // req.user = payload; //TODO: ik denk dat iets in deze aard niet nodig is want in next() wordt de opgevraagde dan weer
      next();
    } catch (error: any) {
      res.status(401).json({ error: error.message || "Niet geauthoriseerd" });
    }
  };
}
