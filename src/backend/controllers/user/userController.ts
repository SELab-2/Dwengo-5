import {NextFunction, Request, Response} from "express";
import {z} from "zod";
import {throwExpressException} from "../../exceptions/ExpressException.ts";
import {prisma} from "../../index.ts";

export async function getUser(req: Request, res: Response, next: NextFunction) {
    const userId = z.coerce.number().safeParse(req.params.userId);
    if (!userId.success) return throwExpressException(400, "invalid userId", next);

    const user = await prisma.user.findUnique({
        where: {id: userId.data}
    });
    if (!user) return throwExpressException(404, "user not found", next);

    const isStudent = !!(await prisma.student.findUnique({where: {id: user.id}}))

    res.status(200).send({
        name: user.username,
        usertype: isStudent ? "student" : "teacher",
        links: {
            classes: req.originalUrl + "/classes"
        }
    });
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
    const userId = z.coerce.number().safeParse(req.params.userId);
    if (!userId.success) return throwExpressException(400, "invalid userId", next);

    const user = await prisma.user.findUnique({
        where: {id: userId.data}
    });
    if (!user) return throwExpressException(404, "user not found", next);

    await prisma.$transaction([
        prisma.classUser.deleteMany({
            where: {user_id: userId.data}
        }),
        prisma.class.deleteMany({//delete classes without teachers
            where: {class_users: {none: {user: {teacher: {}}}}}
        }),
        prisma.submission.updateMany({
            where: {graded_by: userId.data},
            data: {graded_by: {set: null}}
        }),
        prisma.user.deleteMany({
            where: {id: userId.data}
        })
    ]);
    res.status(200).send();
}
