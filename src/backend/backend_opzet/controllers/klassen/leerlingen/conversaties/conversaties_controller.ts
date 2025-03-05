import {Request, Response} from "express";
import {prisma, website_base} from "../../../../index.ts";
import {z} from "zod";
import {ExpressException} from "../../../../exceptions/ExpressException.ts";

export async function leerling_conversaties(req: Request, res: Response) {
    const classId = z.number().safeParse(req.params.klas_id);
    const studentId = z.number().safeParse(req.params.leerling_id);
    if (!classId.success) throw new ExpressException(400, "invalid classId");
    if (!studentId.success) throw new ExpressException(400, "invalid studentId");

    const classroom = await prisma.class.findUnique({
        where: {id: classId.data}
    });
    if (!classroom) throw new ExpressException(404, "class not found");

    const student = await prisma.student.findUnique({
        where: {id: studentId.data}
    });
    if (!student) throw new ExpressException(404, "student not found");
    res.status(501);

    const conversations = await prisma.conversation.findMany({
        where: {
            groups:
                {students_groups: {some: {students_id: studentId.data}}}
        }
    });
    const conversationsLinks = conversations.map(conversation =>
        website_base + "/klassen/" + classId + "/opdrachten/" + conversation.assignment +
        "/groepen/" + conversation.group + "/conversaties/" + conversation.id);
    res.status(200).send(conversationsLinks);
}