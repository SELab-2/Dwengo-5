import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../../index.ts";
import { throwExpressException } from "../../exceptions/ExpressException.ts";

// GET "leerling/:leerling_id"
export async function leerling(req: Request, res: Response, next: NextFunction) {
    const studentId = z.coerce.number().safeParse(req.params.leerling_id);
    if (!studentId.success) return throwExpressException(400, "invalid studentId", next);

  const student = await prisma.student.findUnique({
    where: { id: studentId.data },
  });
  if (!student) return throwExpressException(404, "student not found", next);

  res.status(200).send({ name: student.username });
}

// DELETE "leerling/:leerling_id"
export async function verwijderLeerling(req: Request, res: Response, next: NextFunction) {
    const studentId = z.coerce.number().safeParse(req.params.leerling_id);
    if (!studentId.success) return throwExpressException(400, "invalid studentId", next);

  const student = await prisma.student.findUnique({
    where: { id: studentId.data },
  });
  if (!student) return throwExpressException(404, "student not found", next);

  // todo: cascing delete (via db)
  await prisma.student.delete({
    where: { id: studentId.data },
  });
  res.status(200).send();
}
