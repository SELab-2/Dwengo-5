import express, {Express, Request, Response} from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import { PrismaClient } from "@prisma/client";

import klassen_router from "./routes/klassen/klassen_router.ts";
import leerkrachten_router from "./routes/leerkrachten/leerkrachten_router.ts";
import leerlingen_router from "./routes/leerlingen/leerlingen_router.ts";
import leerobjecten_router from "./routes/leerobjecten/leerobjecten_router.ts";
import leerpaden_router from "./routes/leerpaden/leerpaden_router.ts";
import authenticatie_router from "./routes/authenticatie/authenticatie_router.ts";


dotenv.config();

export const prisma = new PrismaClient();

const index: Express = express();
index.use(cors());
index.use(bodyParser.json());

index.use("/authenticatie", authenticatie_router);
index.use("/klassen", klassen_router);
index.use("/leerkrachten", leerkrachten_router);
index.use("/leerlingen", leerlingen_router);
index.use("/leerobjecten", leerobjecten_router);
index.use("/leerpaden", leerpaden_router);

index.get("/ping", (req: Request, res: Response) => {
    console.log("pong");
    res.status(200).send({message: "pong"});
});

const PORT = process.env.PORT || 2197; // TODO: Thorsten conversaties hoe exact .env te fixen

index.listen(PORT, () => {
    console.log(`Het programma luistert op poort ${PORT}...`);
});

export const website_base: string = "www.dwengo.be"

export default index; //voor testen