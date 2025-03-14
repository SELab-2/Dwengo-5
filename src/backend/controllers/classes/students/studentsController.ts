import {NextFunction, Request, Response} from "express";
import {prisma} from "../../../index.ts";
import {z} from "zod";
import {
  doesTokenBelongToStudentInClass,
  doesTokenBelongToTeacherInClass,
  getJWToken,
} from "../../authentication/extraAuthentication.ts";
import {throwExpressException} from "../../../exceptions/ExpressException.ts";

const leerlingUrlSchema = z.object({
    leerling: z
        .string()
        .trim()
        .regex(/^\/leerlingen\/\d+$/, "geen geldige url, format: /students/{id}"),
});

// GET /classes/:classId/students
export async function klasLeerlingen(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const classId = z.coerce.number().safeParse(req.params.classId);
    if (!classId.success)
        return throwExpressException(400, "invalid classId", next);

    // auth
    const JWToken = getJWToken(req, next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    const auth2 = await doesTokenBelongToStudentInClass(classId.data, JWToken);
    if (!(auth1.success || auth2.success))
        return throwExpressException(
            403,
            auth1.errorMessage + " and " + auth2.errorMessage,
            next
        );

    const students = await prisma.classStudent.findMany({
        where: {
            classes_id: classId.data,
        },
        select: {
            students_id: true,
        },
    });
    const studentLinks = students.map(
        (student) => "/students/" + student.students_id
    );
    res.status(200).send({leerlingen: studentLinks});
}

// POST /classes/:classId/students
// todo: hoe werken met wachtrij
export async function klasLeerlingToevoegen(
    req: Request,
    res: Response,
    next: NextFunction
) {
    //todo: auth (ik weet niet wat hier de auth moet zijn)

    // controleer de parameters/body
    const leerlingUrlResult = leerlingUrlSchema.safeParse(req.body);
    if (!leerlingUrlResult.success) return throwExpressException(400, "wrong body", next);

    const classId = z.coerce.number().safeParse(req.params.classId);
    if (!classId.success) return throwExpressException(400, "invalid classId", next);

    const leerlingUrl: string = leerlingUrlResult.data.leerling;
    const leerlingId: number = Number(leerlingUrl.split("/").pop());

    // controleer of de klas bestaat
    const klas = await prisma.class.findUnique({
        where: {
            id: classId.data,
        },
    });
    if (!klas) return throwExpressException(404, "class not found", next);

    // controleer of de leerling bestaat
    const leerling = await prisma.student.findUnique({
        where: {
            id: leerlingId,
        },
    });
    if (!leerling) return throwExpressException(404, "student not found", next);

    // voeg leerling toe aan de klas
    await prisma.classStudent.create({
        data: {
            classes_id: classId.data,
            students_id: leerlingId,
        },
    });
    res.status(200).send();
}

// DELETE /classes/:classId/students/:studentId
export async function klasLeerlingVerwijderen(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const studentId = z.coerce.number().safeParse(req.params.studentId);
    const classId = z.coerce.number().safeParse(req.params.classId);
    if (!studentId.success)
        return throwExpressException(400, "invalid studentId", next);
    if (!classId.success)
        return throwExpressException(400, "invalid classId", next);

    const classroom = prisma.class.findUnique({
        where: {
            id: classId.data,
        },
    });
    if (!classroom) return throwExpressException(404, "class doens't exist", next);

    // auth
    const JWToken = getJWToken(req, next);
    const auth = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    if (!auth.success) return throwExpressException(403, auth.errorMessage, next);

    const student = await prisma.classStudent.findFirst({
        where: {
            classes_id: classId.data,
            students_id: studentId.data,
        },
    });
    if (!student) return throwExpressException(404, "student not found", next);

    await prisma.classStudent.delete({
        where: {
            classes_id_students_id: {
                classes_id: classId.data,
                students_id: studentId.data
            }
        }
    });
    res.status(200).send();
}
