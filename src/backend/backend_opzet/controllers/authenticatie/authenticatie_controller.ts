import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();
const JWT_SECRET = "temp"; // TODO: maak dit echt secret

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// --------
// Leerling
// --------

const studentSchema = z.object({
  username: z.string(),
  password: z.string(),
  email: z.string().email(),
  active_language: z.string(),
});

export const aanmeldenLeerling = async (req: Request, res: Response) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: "Ontbrekende of incorrect ingevulde velden.",
      details: result.error.errors,
    });
  }
  const { email, password } = result.data;

  try {
    const student = await prisma.student.findUnique({ where: { email } });
    if (!student || !student.password) {
      return res.status(401).json({ error: "Ongeldige inloggegevens." });
    }

    const isPasswordValid = await bcrypt.compare(password, student.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Ongeldige inloggegevens." });
    }

    const token = jwt.sign(
      { id: student.id, email: student.email, type: "student" },
      JWT_SECRET, // TODO: wat allemaal nodig?
      { expiresIn: "1h" } // TODO: tijd?
    );

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Een onverwachte fout is opgetreden." });
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
  const { username, password, email, active_language } = result.data;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = await prisma.student.create({
      data: {
        username,
        password: hashedPassword,
        email,
        active_language,
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
        .json({ error: `E-mailadres ${email} is al in gebruik.` });
    }
    res.status(500).json({ error: "Een onverwachte fout is opgetreden." });
  }
};

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
  const { username, password, email, active_language } = result.data;

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
