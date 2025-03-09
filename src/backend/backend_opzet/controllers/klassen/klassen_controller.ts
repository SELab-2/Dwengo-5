import {Request, Response} from "express";
import {prisma} from "../../index.ts";
import {z} from "zod"
import {ExpressException} from "../../exceptions/ExpressException.ts";
import {
    doesTokenBelongToStudentInClass,
    doesTokenBelongToTeacher,
    doesTokenBelongToTeacherInClass,
    getJWToken
} from "../authenticatie/extra_auth_functies.ts";

const maakKlas = z.object({
    naam: z.string(),
    leerkracht: z.string().regex(/^\/leerkrachten\/\d+$/),
});

export async function maak_klas(req: Request, res: Response) {
    const body = maakKlas.safeParse(req.body);
    if (!body.success) throw new ExpressException(400, "invalid request body");
    const name = body.data.naam;
    const teacherId = z.number().parse(body.data.leerkracht.split("/").at(-1));

    const teacher = await prisma.teacher.findUnique({
        where: {id: teacherId}
    });
    if (!teacher) throw new ExpressException(404, "teacher not found");

    const JWToken = getJWToken(req);
    const auth1 = await doesTokenBelongToTeacher(teacherId, JWToken);
    if (!auth1.success) throw new ExpressException(403, auth1.errorMessage);

    await prisma.class.create({
        data: {
            name: name,
            classes_teachers: {
                create: [{
                    teachers: {
                        connect: {
                            id: teacherId
                        }
                    }
                }]
            }
        }
    });
    res.status(200).send();
}

export async function klas(req: Request, res: Response) {
    const classId = z.number().safeParse(req.params.klas_id);
    if (!classId.success) throw new ExpressException(400, "invalid class id");

    const classroom = await prisma.class.findUnique({
        where: {id: classId.data}
    });
    if (!classroom) throw new ExpressException(404, "class not found");

    //auth
    const JWToken = getJWToken(req);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    const auth2 = await doesTokenBelongToStudentInClass(classId.data, JWToken);
    if (!(auth1.success || auth2.success))
        throw new ExpressException(403, auth1.errorMessage + " and " + auth2.errorMessage);

    res.status(200).send({naam: classroom.name});
}

export async function verwijder_klas(req: Request, res: Response) {
    const classId = z.number().safeParse(req.params.klas_id);
    if (!classId.success) throw new ExpressException(400, "invalid class id");

    const classroom = await prisma.class.findUnique({
        where: {id: classId.data}
    });
    if (!classroom) throw new ExpressException(404, "class not found");

    //auth
    const JWToken = getJWToken(req);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    if (!auth1.success) throw new ExpressException(403, auth1.errorMessage);

    await prisma.class.delete({where: {id: classId.data}});
    res.status(200).send();
}