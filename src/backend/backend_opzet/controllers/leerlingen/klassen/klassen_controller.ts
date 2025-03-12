import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../index.ts";
import { z } from "zod";
import { ExpressException } from "../../../exceptions/ExpressException.ts";

// GET /leerlingen/:leerling_id/klassen
export async function leerlingKlassen(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const studentId = z.coerce.number().safeParse(req.params.leerling_id);
  if (!studentId.success)
    throw new ExpressException(400, "invalid studentId", next);

  const leerling = await prisma.student.findUnique({
    where: { id: studentId.data },
  });
  if (!leerling) throw new ExpressException(404, "student not found", next);

  const classes = await prisma.classStudent.findMany({
    where: { students_id: studentId.data },
  });
  const classesLinks = classes.map(
    (klas) => `/klassen/${klas.classes_id}`
  );
  res.status(200).send(classesLinks);
}
