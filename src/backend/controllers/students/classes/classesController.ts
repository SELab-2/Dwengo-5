import {NextFunction, Request, Response} from "express";
import {prisma} from "../../../index.ts";
import {z} from "zod";
import {throwExpressException} from "../../../exceptions/ExpressException.ts";
import {classLink} from "../../../help/links.ts";
import {doesTokenBelongToStudent, getJWToken} from "../../authentication/extraAuthentication.ts";

export async function getStudentClasses(req: Request, res: Response, next: NextFunction) {
    const studentId = z.coerce.number().safeParse(req.params.studentId);
    if (!studentId.success) return throwExpressException(400, "invalid studentId", next);

    const JWToken = getJWToken(req, next);
    const auth1 = await doesTokenBelongToStudent(studentId.data, JWToken);
    if (!auth1.success) return throwExpressException(403, auth1.errorMessage, next);

    //student exist check done by auth

    const classes = await prisma.classStudent.findMany({
        where: {students_id: studentId.data},
    });
    const classesLinks = classes.map(classroom => classLink(classroom.classes_id));
    res.status(200).send({classes: classesLinks});
}
