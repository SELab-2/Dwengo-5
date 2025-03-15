import {NextFunction, Request, Response} from "express";
import {prisma} from "../../../index.ts";
import {throwExpressException} from "../../../exceptions/ExpressException.ts";
import {z} from "zod";
import {assignmentLink, learninpathLink, splitIdToString} from "../../../help/links.ts";

export async function getClassAssignments(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    if (!classId.success) return throwExpressException(400, "invalid classId", next);

    const classroom = prisma.class.findUnique({
        where: {id: classId.data}
    });
    if (!classroom) return throwExpressException(404, "class not found", next);

    const assignments = await prisma.assignment.findMany({
        where: {class: classId.data}
    });
    const assignmentLinks = assignments.map(assignment => assignmentLink(classId.data, assignment.id));
    res.status(200).send({assignments: assignmentLinks});
}

export async function postClassAssignment(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const learningpath = z.string().safeParse(req.body.leerpad);
    const deadline = z.coerce.date().safeParse(req.body.deadline);
    const name = z.coerce.string().safeParse(req.body.name);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!learningpath.success) return throwExpressException(400, "invalid learningPath", next);
    if (!deadline.success) return throwExpressException(400, "invalid deadline", next);
    if (!name.success) return throwExpressException(400, "invalid name", next);

    const klas = prisma.class.findUnique({
        where: {id: classId.data}
    });
    if (klas === null) return throwExpressException(404, "class not found", next);

    const leerpad = await prisma.learningPath.findUnique({
        where: {uuid: splitIdToString(learningpath.data)}
    });
    if (!leerpad) return throwExpressException(400, "learningpath not found", next);

    await prisma.assignment.create({
        data: {
            name: name.data,
            created_at: new Date(),
            classes: {
                connect: {id: classId.data}
            },
            learning_paths: {
                connect: {uuid: splitIdToString(learningpath.data)}
            }
        },
    });
    res.status(200).send();
}

export async function getClassAssignment(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const assignmentId = z.coerce.number().safeParse(req.params.assignmentId);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!assignmentId.success) return throwExpressException(400, "invalid assignmentId", next);

    const classroom = await prisma.class.findUnique({
        where: {id: classId.data}
    });
    if (!classroom) return throwExpressException(404, "class not found", next);

    const assignment = await prisma.assignment.findUnique({
        where: {
            id: assignmentId.data,
            class: classId.data,
        },
    });
    if (!assignment) return throwExpressException(404, "assignment not found", next);

    res.status(200).send({
        created_at: assignment.created_at,
        deadline: assignment.deadline,
        learning_path: learninpathLink(assignment.learning_path),
        name: assignment.name,
    });
}

export async function deleteClassAssignment(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const assignmentId = z.coerce.number().safeParse(req.params.assignmentId);

    if (!classId.success) return throwExpressException(400, "invalid classId", next);
    if (!assignmentId.success) return throwExpressException(400, "invalid assignmentId", next);

    const classroom = prisma.class.findUnique({
        where: {id: classId.data}
    });
    if (!classroom) return throwExpressException(404, "class not found", next);

    const assignment = await prisma.assignment.findUnique({
        where: {id: assignmentId.data}
    });
    if (!assignment) return throwExpressException(404, "assignment not found", next);

    await prisma.assignment.delete({
        where: {id: assignmentId.data},
    });
    res.status(200).send();
}
