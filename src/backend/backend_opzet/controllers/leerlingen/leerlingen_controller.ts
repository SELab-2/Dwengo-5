import {Request, Response} from "express";
import {PrismaClient} from '@prisma/client'
import {z} from "zod";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";

const prisma = new PrismaClient()

export async function leerling(req: Request, res: Response) {
    try {
        let studentId = z.number().safeParse(req.params.leerling_id);
        if (!studentId.success) {
            res.status(400).send({error: "invalid studentId"});
            return;
        }
        const student = await prisma.student.findUnique({
            where: {
                id: studentId.data
            }
        });
        if (!student) {
            res.status(404).send({error: "non existent student"});
            return;
        }
        res.status(200).send({name: student.username});
    } catch (e) {
        res.status(500).send({error: "internal error"})
    }
}

export async function verwijder_leerling(req: Request, res: Response) {
    try {
        let studentId = z.number().safeParse(req.params.leerling_id);
        if (!studentId.success) {
            res.status(400).send({error: "invalid studentId"});
            return;
        }
        try {
            await prisma.student.delete({
                where: {
                    id: studentId.data
                }
            });
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError && e.code === "P2025") {
                res.status(400).send({error: "class doesn't exist"});
                return;
            }
            throw e;
        }
        res.status(200).send();
    } catch (e) {
        res.status(500).send({error: "internal error"})
    }
}
