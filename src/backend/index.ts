import express, {Request, Response} from "express";
import {JsonLeerlingObject, JsonLeerkrachtObject, JsonMdObject, JsonVoruitgangObject} from "./json_objecten.ts";

import * as Vk from  "./express_views/klassen.ts";
import * as Vlk from  "./express_views/leerkrachten.ts";
import * as Vll from  "./express_views/leerlingen.ts";
import * as Vv from  "./express_views/leerlingen_voruitgang.ts";
import * as Vp from  "./express_views/leerpaden.ts";
import * as Vo from  "./express_views/vragen.ts";

const app = express();
const POORT = 8000;


app.listen(POORT, () => console.log("server werkt en luistert op url: 127.0.0.1:" + POORT));

[Vk, Vlk, Vll, Vv, Vp, Vo].forEach(module => module.register_views(app));