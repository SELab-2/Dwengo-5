import express, { Express, urlencoded, json } from 'express';
import dotenv from 'dotenv';

import klassen_router from './routes/klassen_router.ts';
import leerkrachten_router from './routes/leerkrachten_router.ts';
import leerlingen_router from './routes/leerlingen_router.ts';
import leerobjecten_router from './routes/leerobjecten_router.ts';
import leerpaden_router from './routes/leerpaden_router.ts';


dotenv.config();

const index: Express = express();

index.use('/klassen', klassen_router);
index.use('/leerkrachten', leerkrachten_router);
index.use('/leerlingen', leerlingen_router);
index.use('/leerobjecten', leerobjecten_router);
index.use('/leepraden', leerpaden_router);

const PORT = process.env.PORT || 2197; // TODO: Thorsten vragen hoe exact .env te fixen

index.listen(PORT, () => {
  console.log(`het programma luistert op poort: ${PORT}...`);
});