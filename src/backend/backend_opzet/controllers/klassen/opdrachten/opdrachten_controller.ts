import {NextFunction, Request, Response} from "express";
import {prisma} from "../../../index.ts";
import {throwExpressException} from "../../../exceptions/ExpressException.ts";
import {z} from "zod";

// GET: /klassen/:klas_id/opdrachten
export async function klasOpdrachten(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.klas_id);
    if (!classId.success) return throwExpressException(400, "invalid classId", next);

    const klas = prisma.class.findUnique({
        where: {
            id: classId.data,
        },
    });

    if (klas === null) return throwExpressException(404, "class not found", next);

    const assignments = await prisma.assignment.findMany({
        where: {
            class: classId.data,
        },
    });

    const assignmentLinks = assignments.map(
        (assignment: { learning_path: string, id: number }) =>
            `/klassen/${classId.data}/opdrachten/${assignment.id}`
    );
    res.status(200).send({opdrachten: assignmentLinks});
}

// POST /klassen/:klas_id/opdrachten
export async function maakOpdracht(req: Request, res: Response, next: NextFunction) {
    try {
        let klas_id_string: string = req.params.klas_id;
        let klas_id: number = Number(klas_id_string);
        let leerpad_id_string: string = req.body.leerpad;
        let leerpad_id: string = leerpad_id_string.split("/").at(-1)!;
        if (isNaN(klas_id)) {
            res.status(400).send({error: "geen geldige klas_id"});
            return;
        }

        const klas = prisma.class.findUnique({
            where: {
                id: klas_id,
            },
        });

        if (klas === null) {
            res
                .status(400)
                .send({error: "klas met klas_id ${klas_id} bestaat niet."});
            return;
        }

        await prisma.assignment.create({
            data: {
                name: "opdracht", // todo: name uit req body halen
                created_at: new Date(),
                classes: {
                    connect: {
                        id: klas_id
                    }
                },
                learning_paths: {
                    connect: {
                        uuid: leerpad_id
                    }
                }
            },
        });
        res.status(200).send("connected assigment succesful");
    } catch (e:any) {
        return throwExpressException(500, e.message!, next);
    }
}

// GET /klassen/:klas_id/opdrachten/:opdracht_id
export async function klasOpdracht(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.klas_id);
    const assignmentId = z.coerce.number().safeParse(req.params.opdracht_id);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!assignmentId.success) return throwExpressException(400, "invalid assignmentId", next);

    const klas = prisma.class.findUnique({
        where: {
            id: classId.data,
        },
    });
    if (klas === null) return throwExpressException(404, "class not found", next);

    const opdracht = prisma.assignment.findUnique({
        where: {
            id: assignmentId.data,
            class: classId.data,
        },
        include: {
            learning_paths: true,
        },
    });

    const leerpad_link =
        `/leerpaden/${opdracht.learning_paths}`;
    res.status(200).send({leerpad: leerpad_link});
}

// DELETE /klassen/:klas_id/opdrachten/:opdracht_id
export async function verwijderOpdracht(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.klas_id);
    const assignmentId = z.coerce.number().safeParse(req.params.opdracht_id);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!assignmentId.success) return throwExpressException(400, "invalid assignmentId", next);

    const klas = prisma.class.findUnique({
        where: {
            id: classId.data,
        },
    });
    if (klas === null) return throwExpressException(404, "class not found", next);

    await prisma.assignment.delete({
        where: {id: assignmentId.data},
    });
    res.status(200).send();
}
