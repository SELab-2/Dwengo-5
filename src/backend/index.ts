import express, {Express, NextFunction, Request, Response} from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import { PrismaClient } from "@prisma/client";

import klassen_router from "./routes/klassen/klassen_router.ts";
import leerkrachten_router from "./routes/teachers/leerkrachten_router.ts";
import leerlingen_router from "./routes/students/leerlingen_router.ts";
import leerobjecten_router from "./routes/learningobjects/leerobjecten_router.ts";
import leerpaden_router from "./routes/learningpaths/leerpaden_router.ts";
import authenticatie_router from "./routes/authenticatie/authenticatie_router.ts";
import { exceptionHandler } from "./exceptions/exceptionMiddleware.ts";
import {ExpressException, throwExpressException} from "./exceptions/ExpressException.ts";

dotenv.config();

export const prisma = new PrismaClient();

const index: Express = express();
index.use(cors());
index.use(bodyParser.json());

index.use("/authenticatie", authenticatie_router);
index.use("/klassen", klassen_router);
index.use("/teachers", leerkrachten_router);
index.use("/students", leerlingen_router);
index.use("/learningobjects", leerobjecten_router);
index.use("/learningpaths", leerpaden_router);

index.get("/ping", (req: Request, res: Response, next:NextFunction) => {
  console.log("pong");
  return throwExpressException(200, "pong", next);
});

index.use(exceptionHandler);

const PORT = process.env.PORT || 2197;

index.listen(PORT, () => {
  console.log(`Het programma luistert op poort ${PORT}...`);
});

export const website_base: string = "www.dwengo.be";
export const JWT_SECRET: string = process.env.JWT_SECRET!;
export default index; //voor testen
