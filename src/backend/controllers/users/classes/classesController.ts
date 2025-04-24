import {NextFunction, Request, Response} from "express";
import {prisma} from "../../../index.ts";
import {z} from "zod";
import {throwExpressException} from "../../../exceptions/ExpressException.ts";
import {classLink} from "../../../help/links.ts";

export async function getUserClasses(req: Request, res: Response, next: NextFunction) {
    const userId = z.coerce.number().safeParse(req.params.userId);
    if (!userId.success) return throwExpressException(400, "invalid userId", next);

    const user = prisma.user.findUnique({
        where: {id: userId.data}
    });
    if (!user) return throwExpressException(404, "users not found", next);

    const classes = await prisma.classUser.findMany({
        where: {user_id: userId.data}
    });
    const classesLinks = classes.map(classroom => classLink(classroom.class_id));
    res.status(200).send({classes: classesLinks});
}
