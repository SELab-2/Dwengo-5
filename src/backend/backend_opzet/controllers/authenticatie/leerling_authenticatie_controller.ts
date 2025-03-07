import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {loginSchema,} from "./authenticatie_controller_common.ts";
import {z} from "zod";
import {Request, Response} from "express";
import {JWT_SECRET, prisma} from "../../index.ts";

// --------
// Leerling
// --------

const studentSchema = z.object({
    username: z.string(),
    password: z.string(),
    email: z.string().email(),
});

export const aanmeldenLeerling = async (req: Request, res: Response) => {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            error: "Ontbrekende of incorrect ingevulde velden.",
            details: result.error.errors,
        });
    }
    let {email, password} = result.data;
    email = email.toLowerCase();

    try {
        const student = await prisma.student.findUnique({where: {email}});
        if (!student || !student.password) {
            return res.status(401).json({error: "Ongeldige inloggegevens."});
        }

        const isPasswordValid = await bcrypt.compare(password, student.password);
        if (!isPasswordValid) {
            return res.status(401).json({error: "Ongeldige inloggegevens."});
        }

        const token = jwt.sign(
            {id: student.id, email: student.email, gebruikerstype: "student"},
            JWT_SECRET, // TODO: wat allemaal nodig?
            {expiresIn: "1h"} // TODO: tijd?
        );

        res.json({message: "Login successful", token});
    } catch (error) {
        res.status(500).json({error: "Een onverwachte fout is opgetreden."});
    }
};

export const registrerenLeerling = async (req: Request, res: Response) => {
    const result = studentSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            error: "Ontbrekende of incorrect ingevulde velden.",
            details: result.error.errors,
        });
    }
    let {username, password, email} = result.data;
    email = email.toLowerCase();

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newStudent = await prisma.student.create({
            data: {
                username,
                password: hashedPassword,
                email,
                created_at: new Date(),
            },
        });

        res.status(201).json({
            message: "Leerling succesvol geregistreerd.",
            studentId: newStudent.id,
        });
    } catch (error: any) {
        // Catch Prisma unique constraint error code P2002 for email
        if (error.code === "P2002" && error.meta?.target?.includes("email")) {
            return res
                .status(409)
                .json({error: `E-mailadres ${email} is al in gebruik.`});
        }
        res.status(500).json({error: "Een onverwachte fout is opgetreden."});
    }
};
