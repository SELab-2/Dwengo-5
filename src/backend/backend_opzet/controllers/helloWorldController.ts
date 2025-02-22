import { Request, Response } from 'express';

export async function helloWorld(req: Request, res: Response) {
    res.send('Hello World!');
}