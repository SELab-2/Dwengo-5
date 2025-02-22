import express, { Express, urlencoded, json } from 'express';
import helloWorldRouter from './routes/helloWorldRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();

// app.use(urlencoded({ extended: true })); // TODO: uncomment only if needed
// app.use(json()); // TODO: uncomment only if needed

app.use('/helloWorld', helloWorldRouter);

const PORT = process.env.PORT || 2197; // TODO: Thorsten vragen hoe exact .env te fixen

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});