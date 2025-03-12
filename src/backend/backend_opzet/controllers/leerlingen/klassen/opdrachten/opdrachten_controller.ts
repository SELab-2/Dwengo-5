import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../../../../index.ts";

// GET /leerlingen/:leerling_id/klassen/:klas_id/opdrachten
export async function leerling_opdrachten(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const studentId = z.coerce.number().safeParse(req.params.leerling_id);
    if (!studentId.success) {
      return res.status(400).json({ error: "invalid studentId" });
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId.data },
    });

    if (!student) {
      return res.status(404).json({ error: "student not found" });
    }

    const classId = z.coerce.number().safeParse(req.params.klas_id);
    if (!classId.success) {
      return res.status(400).json({ error: "Invalid classId" });
    }

    const klas = await prisma.class.findUnique({
      where: { id: classId.data },
    });

    if (!klas) {
      return res.status(404).json({ error: "class not found" });
    }

    const assignments = await prisma.assignment.findMany({
      where: {
        groups: {
          some: {
            students_groups: {
              some: {
                students_id: studentId.data,
              },
            },
          },
        },
      },
    });

    const assignmentLinks = assignments.map(
      (assignment) => "/opdrachten/" + assignment.id
    );
    return res.status(200).json(assignmentLinks);
  } catch (error) {
    next(error);
  }
}
