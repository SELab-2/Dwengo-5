import {Request, Response} from "express";
import {z} from "zod";
import {prisma} from "../../index.ts";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";

export async function leerkracht(req: Request, res: Response) {
    try {
        let teacherId = z.number().safeParse(req.params.leerkracht_id);
        if (!teacherId.success) {
            res.status(400).send({error: "invalid teacherId"});
            return;
        }
        const teacher = await prisma.teacher.findUnique({
            where: {
                id: teacherId.data
            }
        });
        if (!teacher) {
            res.status(404).send({error: "teacher not found"});
            return;
        }
        res.status(200).send({naam: teacher.username});
    } catch (e) {
        res.status(500).send({error: "internal error"})
    }
}

export async function verwijder_leerkracht(req: Request, res: Response) {
    try {
        let teacherId = z.number().safeParse(req.params.leerkracht_id);
        if (!teacherId.success) {
            res.status(400).send({error: "invalid teacherId"});
            return;
        }
        try {
            await prisma.teacher.delete({
                where: {
                    id: teacherId.data
                }
            })
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError && e.code === "P2025") {
                res.status(404).send({error: "class doesn't exist"});
                return;
            }
            throw e;
        }
        res.status(200).send();
    } catch (e) {
        res.status(500).send({error: "internal error"})
    }
}
