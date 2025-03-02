import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {
  JWT_SECRET,
  loginSchema,
} from "./authenticatie_controller_common.ts";
import { z } from "zod";
import { Request, Response } from "express";
import { prisma } from "../../index.ts";

// ---------
// Leekracht
// ---------

const teacherSchema = z.object({
  username: z.string(),
  password: z.string(),
  email: z.string().email(),
  active_language: z.string(),
});

export const aanmeldenLeerkracht = async (req: Request, res: Response) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: "Ontbrekende of incorrect ingevulde velden.",
      details: result.error.errors,
    });
  }
  const { email, password } = result.data;

  try {
    const teacher = await prisma.teacher.findUnique({ where: { email } });
    if (!teacher || !teacher.password) {
      return res.status(401).json({ error: "Ongeldige inloggegevens." });
    }

    const isPasswordValid = await bcrypt.compare(password, teacher.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Ongeldige inloggegevens." });
    }

    const token = jwt.sign(
      { id: teacher.id, email: teacher.email, type: "teacher" },
      JWT_SECRET, // TODO: wat exact signen?
      { expiresIn: "1h" } // TODO: decide on expiration time
    );

    res.json({ message: "Leerkracht succesvol ingelogd.", token }); // TODO: message nodig?
  } catch (error) {
    res.status(500).json({ error: "Een onverwachte fout is opgetreden." });
  }
};

export const registrerenLeerkracht = async (req: Request, res: Response) => {
  const result = teacherSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: "Ontbrekende of incorrect ingevulde velden.",
      details: result.error.errors,
    });
  }
  let { username, password, email, active_language } = result.data;
  email = email.toLowerCase();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newTeacher = await prisma.teacher.create({
      data: {
        username,
        password: hashedPassword,
        email,
        active_language,
        created_at: new Date(),
      },
    });

    res.status(201).json({
      message: "Leerkracht succesvol geregistreerd.",
      teacherId: newTeacher.id, // TODO: is dit retourneren nodig?
    });
  } catch (error: any) {
    // Prisma produceert errorcode P2002 bij inbreuken op unique.
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      res.status(409).json({ error: `E-mailadres ${email} is al in gebruik.` });
      return;
    }
    res.status(500).json({ error: "Een onverwachte fout is opgetreden." });
  }
};
