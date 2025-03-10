import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {loginSchema} from "./authenticatie_controller_common.ts";
import {z} from "zod";
import {Request, Response} from "express";
import {JWT_SECRET, prisma} from "../../index.ts";

// ---------
// Leekracht
// ---------

const teacherSchema = z.object({
    username: z.string(),
    password: z.string(),
    email: z.string().email(),
});

// POST /authenticatie/aanmelden?gebruikerstype=leerkracht"
export const aanmeldenLeerkracht = async (req: Request, res: Response) => {
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
        const teacher = await prisma.teacher.findUnique({where: {email}});
        console.log("Teacher Id")
        if(teacher !== null){
            console.log(teacher.id)
        }
        
        if (!teacher || !teacher.password) {
            return res.status(401).json({error: "Ongeldige inloggegevens."});
        }

        const isPasswordValid = await bcrypt.compare(password, teacher.password);
        if (!isPasswordValid) {
            return res.status(401).json({error: "Ongeldige inloggegevens."});
        }

        const token = jwt.sign(
            {id: teacher.id, email: teacher.email, gebruikerstype: "teacher"}, // TODO: dit mogelijk dmv Zod?
            JWT_SECRET, // TODO: wat exact signen?
            {expiresIn: "1h"} // TODO: decide on expiration time
        );

        res.json({message: "Leerkracht succesvol ingelogd.", token}); // TODO: message nodig?
    } catch (error) {
        res.status(500).json({error: "Een onverwachte fout is opgetreden."});
    }
};

// POST /authenticatie/registreren?gebruikerstype=leerkracht"
export const registrerenLeerkracht = async (req: Request, res: Response) => {
    const result = teacherSchema.safeParse(req.body);
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

        const newTeacher = await prisma.teacher.create({
            data: {
                username,
                password: hashedPassword,
                email,
                created_at: new Date(),
            },
        });

        res.status(200).json({
            message: "Leerkracht succesvol geregistreerd.",
            teacherId: newTeacher.id, // TODO: is dit retourneren nodig? Antwoord van Quinten: Ja voor de testen is dit wel handig
        });
    } catch (error: any) {
        // Prisma produceert errorcode P2002 bij inbreuken op unique.
        if (error.code === "P2002" && error.meta?.target?.includes("email")) {
            res.status(409).json({error: `E-mailadres ${email} is al in gebruik.`});
            return;
        }
        res.status(500).json({error: "Een onverwachte fout is opgetreden."});
    }
};
