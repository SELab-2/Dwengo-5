import {NextFunction, Request, Response} from "express";
import {z} from "zod";
import {prisma} from "../../index.ts";
import {throwExpressException} from "../../exceptions/ExpressException.ts";

export async function getTeacher(req: Request, res: Response, next: NextFunction) {
    const teacherId = z.coerce.number().safeParse(req.params.teacherstudentId);
    if (!teacherId.success) return throwExpressException(400, "invalid teacherId", next);

    const teacher = await prisma.teacher.findUnique({
        where: {
            id: teacherId.data,
        },
    });
    if (!teacher) return throwExpressException(404, "teacher not found", next);

    res.status(200).send({name: teacher.username});
}

export async function deleteTeacher(req: Request, res: Response, next: NextFunction) {
    const teacherId = z.coerce.number().safeParse(req.params.teacherstudentId);
    if (!teacherId.success) return throwExpressException(400, "invalid teacherId", next);

    const teacher = prisma.teacher.findUnique({
        where: {id: teacherId.data},
    });
    if (!teacher) return throwExpressException(404, "teacher not found", next);

    await prisma.$transaction([
        prisma.classTeacher.deleteMany({
            where: {
                teachers_id: teacherId.data
            }
        }),
        prisma.classStudent.deleteMany({
            where: {
                classes: {
                    classes_teachers: {
                        none: {}
                    }
                }
            }
        }),
        //delete classes without teachers
        prisma.class.deleteMany({
            where: {
                classes_teachers: {
                    none: {}
                }
            }
        }),
        prisma.submission.updateMany({
            where: {
                graded_by: teacherId.data
            },
            data: {
                graded_by: {
                    set: null
                }
            }
        }),
        prisma.teacher.deleteMany({
            where: {id: teacherId.data},
        })
    ]);
    res.status(200).send();
}
