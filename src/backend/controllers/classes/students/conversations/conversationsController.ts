import {NextFunction, Request, Response} from "express";
import {prisma} from "../../../../index.ts";
import {z} from "zod";
import {throwExpressException} from "../../../../exceptions/ExpressException.ts";

export async function getStudentConversations(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    const studentId = z.coerce.number().safeParse(req.params.studentId);
    if (!classId.success)
        return throwExpressException(400, "invalid classId", next);
    if (!studentId.success)
        return throwExpressException(400, "invalid studentId", next);

    const classroom = await prisma.class.findUnique({
        where: {id: classId.data},
    });
    if (!classroom) return throwExpressException(404, "class not found", next);

    const student = await prisma.student.findUnique({
        where: {id: studentId.data},
    });
    if (!student) return throwExpressException(404, "student not found", next);

    const conversations = await prisma.conversation.findMany({
        where: {
            groups: {students_groups: {some: {students_id: studentId.data}}},
        },
    });
    const conversationsLinks = conversations.map(
        (conversation) =>
            `/klassen/${classId.data}/opdrachten/${conversation.assignment}/groepen/${conversation.group}/conversaties/${conversation.id}`
    );
    res.status(200).send({conversaties: conversationsLinks});
}
