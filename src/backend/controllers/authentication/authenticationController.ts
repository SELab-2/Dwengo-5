import { NextFunction, Request, Response } from "express";
import { throwExpressException } from "../../exceptions/ExpressException.ts";
import { z } from "zod";
import { NextFunction, Request, Response } from "express";
import { throwExpressException } from "../../exceptions/ExpressException.ts";
import { z } from "zod";
import bcrypt from "bcryptjs";
import {  JWT_SECRET, prisma  } from "../../index.ts";
import jwt from "jsonwebtoken";
import { userLink } from "../../help/links.ts";
import { studentToLink, teacherToLink } from "../../__tests__/helperFunctions.ts";

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const email = z.string().email().safeParse(req.body.email);
    const password = z.string().safeParse(req.body.password);

    if (!email.success) return throwExpressException(400, "invalid email", next);
    if (!password.success) return throwExpressException(400, "invalid password", next);

    const user = await prisma.user.findUnique({ where: { email: email.data } });
    if (!user) return throwExpressException(404, "user not found", next);

    const isPasswordValid = await bcrypt.compare(password.data, user.password);
    if (!isPasswordValid) return throwExpressException(401, "wrong password", next);

    const isStudent = !!(await prisma.student.findUnique({ where: { id: user.id } }));

    const token = jwt.sign(
        { id: user.id, email: user.email, usertype: isStudent ? "student" : "teacher" },
        JWT_SECRET,
        { expiresIn: "8h" }
    );
    res.status(200).send({
        token: token,
        user: userLink(user.id)
    });
};

export async function register(req: Request, res: Response, next: NextFunction) {
    const username = z.string().safeParse(req.body.username);
    const password = z.string().safeParse(req.body.password);
    const email = z.string().email().safeParse(req.body.email);
    const usertype = z.enum(["student", "teacher"]).safeParse(req.query.usertype);

    if (!username.success) return throwExpressException(400, "invalid username", next);
    if (!password.success) return throwExpressException(400, "invalid password", next);
    if (!email.success) return throwExpressException(400, "invalid email", next);
    if (!usertype.success) return throwExpressException(400, "invalid usertype", next);

    try {
        const hashedPassword = await bcrypt.hash(password.data, 10);
        let user;
        await prisma.$transaction(async (tx) => {
            user = await tx.user.create({
                data: {
                    username: username.data,
                    password: hashedPassword,
                    email: email.data,
                    created_at: new Date()
                }
            });
            if (usertype.data == "student") await tx.student.create({ data: { id: user.id } });
            else await tx.teacher.create({ data: { id: user.id } })
        });

        res.status(200).send({ user: userLink(user!.id) });
    } catch (error: any) {
        if (error.code === "P2002" && error.meta?.target?.includes("email")) return throwExpressException(409, "mail already in use", next);
        else throw error;
    }
}