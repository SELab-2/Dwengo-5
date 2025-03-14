import {NextFunction, Request, Response} from "express";
import {prisma} from "../../../index.ts";
import {throwExpressException} from "../../../exceptions/ExpressException.ts";
import {z} from "zod";

// GET: /classes/:classId/assignments
export async function klasOpdrachten(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
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

// POST /classes/:classId/assignments
export async function maakOpdracht(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const learningpath = z.string().safeParse(req.body.leerpad);
    const deadline = z.coerce.date().safeParse(req.body.deadline);
    const name = z.coerce.string().safeParse(req.body.name);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!learningpath.success) return throwExpressException(400, "invalid learningPath", next);
    if (!deadline.success) return throwExpressException(400, "invalid deadline", next);
    if (!name.success) return throwExpressException(400, "invalid name", next);

    const klas = prisma.class.findUnique({
        where: {
            id: classId.data,
        },
    });
    if (klas === null) return throwExpressException(404, "class not found", next);

    const leerpad = await prisma.learningPath.findUnique({
        where: {
            uuid: learningpath.data.split("/").at(-1),
        },
    });
    if (!leerpad) {
        return throwExpressException(400, `learningPath with uuid: ${learningpath} does not exist`, next);
    }

    await prisma.assignment.create({
        data: {
            name: "opdracht", // todo: name uit req body halen
            created_at: new Date(),
            classes: {
                connect: {
                    id: classId.data
                }
            },
            learning_paths: {
                connect: {
                    uuid: learningpath.data.split("/").at(-1)
                }
            }
        },
    });
    res.status(200).send("connected assigment succesful");
}

// GET /classes/:classId/assignments/:assignmentId
export async function klasOpdracht(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const assignmentId = z.coerce.number().safeParse(req.params.assignmentId);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!assignmentId.success) return throwExpressException(400, "invalid assignmentId", next);

    const classroom = await prisma.class.findUnique({
        where: {
            id: classId.data,
        },
    });
    if (classroom === null) return throwExpressException(404, "class not found", next);

    const assignment = await prisma.assignment.findUnique({
        where: {
            id: assignmentId.data,
            class: classId.data,
        },
    });

    if (assignment === null) return throwExpressException(404, "assignment not found", next);

    const opdrachtLink =
        `/klassen/${classId}/opdrachten/${assignmentId}`;
    res.status(200).send({
        created_at: assignment.created_at,
        deadline: assignment.deadline,
        learning_path: `/leerpaden/${assignment.learning_path}`,
        name: assignment.name,
    });
}

// DELETE /classes/:classId/assignments/:assignmentId
export async function verwijderOpdracht(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const assignmentId = z.coerce.number().safeParse(req.params.assignmentId);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!assignmentId.success) return throwExpressException(400, "invalid assignmentId", next);

    const klas = prisma.class.findUnique({
        where: {
            id: classId.data,
        },
    });
    if (klas === null) return throwExpressException(404, "class not found", next);

    const assignment = await prisma.assignment.findUnique({
        where: {
            id: assignmentId.data,
        },
    });

    if (assignment === null) return throwExpressException(404, "assignment not found", next);

    await prisma.assignment.delete({
        where: {id: assignmentId.data},
    });
    res.status(200).send();
}
