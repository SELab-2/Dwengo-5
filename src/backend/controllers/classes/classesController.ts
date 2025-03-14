import {NextFunction, Request, Response} from "express";
import {prisma} from "../../index.ts";
import {z} from "zod"
import {throwExpressException} from "../../exceptions/ExpressException.ts";
import {
    doesTokenBelongToStudentInClass,
    doesTokenBelongToTeacher,
    doesTokenBelongToTeacherInClass,
    getJWToken,
} from "../authentication/extraAuthentication.ts";

const maakKlasSchema = z.object({
    naam: z.string(),
    leerkracht: z.string().regex(/^\/leerkrachten\/\d+$/),
});

export async function maakKlas(req: Request, res: Response, next: NextFunction) {
    const body = maakKlasSchema.safeParse(req.body);

    if (!body.success) return throwExpressException(400, "invalid request body", next);
    const name = body.data.naam;
    const teacherId = z.coerce.number().parse(body.data.leerkracht.split("/").pop());

    const teacher = await prisma.teacher.findUnique({
        where: {id: teacherId}
    });
    if (!teacher) return throwExpressException(404, "teacher not found", next);

    const JWToken = getJWToken(req, next);

    const auth1 = await doesTokenBelongToTeacher(teacherId, JWToken);
    if (!auth1.success) return throwExpressException(403, auth1.errorMessage, next);

    let classroom = await prisma.class.create({
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

    res.status(200).send({id: classroom.id});
}

export async function klas(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    if (!classId.success) return throwExpressException(400, "invalid class id", next);

    const classroom = await prisma.class.findUnique({
        where: {id: classId.data},
    });
    if (!classroom) return throwExpressException(404, "class not found", next);

    //auth
    const JWToken = getJWToken(req, next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    const auth2 = await doesTokenBelongToStudentInClass(classId.data, JWToken);
    if (!(auth1.success || auth2.success))
        return throwExpressException(
            403,
            auth1.errorMessage + " and " + auth2.errorMessage,
            next
        );

    res.status(200).send({naam: classroom.name});
}

export async function verwijderKlas(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    if (!classId.success) return throwExpressException(400, "invalid class id", next);

    const classroom = await prisma.class.findUnique({
        where: {id: classId.data},
    });
    if (!classroom) return throwExpressException(404, "class not found", next);

    //auth
    const JWToken = getJWToken(req, next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    if (!auth1.success) return throwExpressException(403, auth1.errorMessage, next);

    await prisma.classTeacher.deleteMany({
        where: {
            classes_id: classId.data
        }
    });
    await prisma.class.delete({
        where: {
            id: classId.data
        }
    });
    res.status(200).send();
}
