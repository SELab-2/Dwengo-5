import express, {Express, NextFunction, Request, Response} from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import {PrismaClient} from "@prisma/client";
import {exceptionHandler} from "./exceptions/exceptionMiddleware.ts";
import {throwExpressException} from "./exceptions/ExpressException.ts";

import classesRouter from "./routes/classes/classesRouter.ts";
import studentsRouter from "./routes/users/usersRouter.ts";
import learningobjectsRouter from "./routes/learningobjects/learningobjectsRouter.ts";
import learningpathsRrouter from "./routes/learningpaths/learningpathsRouter.ts";
import authenticationRouter from "./routes/authentication/authenticationRouter.ts";

dotenv.config();

export const prisma = new PrismaClient();

const index: Express = express();
index.use('*', cors());
index.use(bodyParser.json());

index.use("/authentication", authenticationRouter);
index.use("/classes", classesRouter);
index.use("/users", studentsRouter);
index.use("/learningobjects", learningobjectsRouter);
index.use("/learningpaths", learningpathsRrouter);

index.get("/ping", (_req: Request, _res: Response, next: NextFunction) => {
    console.log("pong");
    return throwExpressException(200, "pong", next);
});

index.use(exceptionHandler);

const PORT = process.env.PORT || 2197;

if (require.main === module) {
    index.listen(PORT, () => {
        console.log(`Het programma luistert op poort ${PORT}...`);
    });
}

export const website_base: string = "www.dwengo.be";
export const JWT_SECRET: string = process.env.JWT_SECRET!;
export default index; //voor testen
