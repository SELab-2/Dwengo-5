import {NextFunction, Request, Response} from "express";
import {throwExpressException} from "../../exceptions/ExpressException.ts";
import {z} from "zod";
import bcrypt from "bcryptjs";
import {JWT_SECRET, prisma} from "../../index.ts";
import jwt from "jsonwebtoken";
import {studentLink, teacherLink} from "../../help/links.ts";

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const email = z.string().email().safeParse(req.body.email);
    const password = z.string().safeParse(req.body.password);
    const usertype = z.string().safeParse(req.query.usertype);

    if (!email.success) return throwExpressException(400, "invalid email", next);
    if (!password.success) return throwExpressException(400, "invalid password", next);
    if (!usertype.success || !(usertype.data == "student" || usertype.data == "teacher"))
        return throwExpressException(400, "invalid usertype", next);

    const table = usertype.data == "student" ? prisma.student : prisma.teacher;
    /* @ts-ignore, requires same data*/
    const user = await table.findUnique({where: {email: email.data}});
    if (!user) return throwExpressException(404, "user not found", next);
    if (!user.password) return throwExpressException(401, "user doesn't have password?", next);

    console.log(password.data, user.password);
    const isPasswordValid = await bcrypt.compare(password.data, user.password);
    if (!isPasswordValid) return throwExpressException(401, "wrong password", next);

    const token = jwt.sign(
        {id: user.id, email: user.email, usertype: usertype.data}, // TODO: dit mogelijk dmv Zod?
        JWT_SECRET, // TODO: wat exact signen?
        {expiresIn: "8h"} // TODO: decide on expiration time
    );
    res.status(200).send({
        token: token,
        user: usertype.data == "student" ? studentLink(user.id) : teacherLink(user.id)
    });
};

export async function register(req: Request, res: Response, next: NextFunction) {
    const username = z.string().safeParse(req.body.username);
    const password = z.string().safeParse(req.body.password);
    const email = z.string().email().safeParse(req.body.email);
    const usertype = z.string().safeParse(req.query.usertype);

    if (!username.success) return throwExpressException(400, "invlid username", next);
    if (!password.success) return throwExpressException(400, "invlid password", next);
    if (!email.success) return throwExpressException(400, "invlid email", next);
    if (!usertype.success || !(usertype.data == "student" || usertype.data == "teacher"))
        return throwExpressException(400, "invlid usertype", next);

    try {
        const hashedPassword = await bcrypt.hash(password.data, 10);
        console.log(password.data, hashedPassword);
        const table = usertype.data == "student" ? prisma.student : prisma.teacher;
        /* @ts-ignore (it needs the same data)*/
        await table.create({
            data: {
                username: username.data,
                password: hashedPassword,
                email: email.data,
                created_at: new Date(),
            },
        });
        res.status(200).send();
    } catch (error: any) {// Catch Prisma unique constraint error code P2002 for email
        if (error.code === "P2002" && error.meta?.target?.includes("email"))
            return throwExpressException(409, "mail already in use", next);
        else throw error;
    }
}