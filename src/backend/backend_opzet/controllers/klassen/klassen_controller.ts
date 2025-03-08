import {Request, Response} from "express";
import {prisma} from "../../index.ts";
import {z} from "zod"
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";

const maakKlas = z.object({
    naam: z.string(),
    leerkracht: z.string(),
});

export async function maak_klas(req: Request, res: Response) {
    //todo: auth
    let body = maakKlas.parse(req.body);
    let teacher_id: number = Number(body.leerkracht.split("/").at(-1));
    if (isNaN(teacher_id)) {
        res.status(400).send({error: "invalid teacher id"});
        return;
    }
    const teacher = await prisma.teacher.findUnique({
        where: {
            id: teacher_id
        }
    });
    if (!teacher) {
        res.status(404).send({error: "teacher not found"});
        return;
    }
    await prisma.class.create({
        data: {
            name: body.naam,
            classes_teachers: {
                create: [{
                    teachers: {
                        connect: {
                            id: teacher_id
                        }
                    }
                }]
            }
        }
    });
    res.status(200).send();
}

export async function klas(req: Request, res: Response) {
    //todo: auth?
    let classId = Number(req.params.klas_id);
    if (isNaN(classId)) {
        res.status(400).send({error: "invalid class id"});
        return;
    }
    const classs = await prisma.class.findUnique({
        where: {
            id: classId
        }
    });
    if (!classs) {
        res.status(404).send({error: "class not found"});
        return;
    }
    res.status(200).send();
}

export async function verwijder_klas(req: Request, res: Response) {
    //todo: auth?
    let classId = Number(req.params.klas_id);
    if (isNaN(classId)) {
        res.status(400).send({error: "invalid class id"});
        return;
    }
    try {
        await prisma.class.delete({where: {id: classId}});
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
            res.status(400).send({error: "class doesn't exist"});
            return
        } else {
            res.status(500).send({error: "internal error"});
            return;
        }
    }
    res.status(200).send();
}