import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { throwExpressException } from "../../exceptions/ExpressException.ts";
import { prisma } from "../../index.ts";
import bcrypt from "bcryptjs";

export async function getUser(req: Request, res: Response, next: NextFunction) {
    const userId = z.coerce.number().safeParse(req.params.userId);
    if (!userId.success) return throwExpressException(400, "invalid userId", next);

    const user = await prisma.user.findUnique({
        where: { id: userId.data }
    });
    if (!user) return throwExpressException(404, "users not found", next);

    const isStudent = !!(await prisma.student.findUnique({ where: { id: user.id } }))

    res.status(200).send({
        name: user.username,
        email: user.email,
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
        where: { id: userId.data }
    });
    if (!user) return throwExpressException(404, "users not found", next);

    await prisma.$transaction([
        prisma.classUser.deleteMany({
            where: { user_id: userId.data }
        }),
        prisma.class.deleteMany({//delete classes without teachers
            where: { class_users: { none: { user: { teacher: {} } } } }
        }),
        prisma.submission.updateMany({
            where: { graded_by: userId.data },
            data: { graded_by: { set: null } }
        }),
        prisma.conversation.deleteMany({
            where: { student_id: userId.data }
        }),
        prisma.teacher.deleteMany({
            where: { id: userId.data }
        }),
        prisma.student.deleteMany({
            where: { id: userId.data }
        }),
        prisma.user.deleteMany({
            where: { id: userId.data }
        })
    ]);
    res.status(200).send();
}


export async function patchUser(req: Request, res: Response, next: NextFunction) {
    const userId = z.coerce.number().safeParse(req.params.userId);
    if (!userId.success) return throwExpressException(400, "invalid userId", next);

    const user = await prisma.user.findUnique({
        where: { id: userId.data }
    });
    if (!user) return throwExpressException(404, "users not found", next);

    const username = z.string().optional().safeParse(req.body.username);
    const password = z.string().optional().safeParse(req.body.password);
    const email = z.string().email().optional().safeParse(req.body.email);

    if (!username.success && !password.success && !email.success) return throwExpressException(400, "invalid data", next);
    if (username.success && username.data) {
        await prisma.user.update({
            where: { id: userId.data },
            data: { username: username.data }
        });
    }

    if (password.success && password.data != undefined) {
        const hashedPassword = await bcrypt.hash(password.data, 10);
        await prisma.user.update({
            where: { id: userId.data },
            data: { password: hashedPassword }
        });
    }
    if (email.success && email.data != undefined) {
        await prisma.user.update({
            where: { id: userId.data },
            data: { email: email.data }
        });
    }

    res.status(200).send();
}