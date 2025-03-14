import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../../index.ts";
import { throwExpressException } from "../../exceptions/ExpressException.ts";

// GET /teachers/:teacherstudentId
export async function leerkracht(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const teacherId = z.coerce.number().safeParse(req.params.teacherstudentId);
  if (!teacherId.success)
    return throwExpressException(400, "invalid teacherId", next);

  const teacher = await prisma.teacher.findUnique({
    where: {
      id: teacherId.data,
    },
  });
  if (!teacher) return throwExpressException(404, "teacher not found", next);

  res.status(200).send({ name: teacher.username });
}

// DELETE /teachers/:teacherstudentId
export async function verwijderLeerkracht(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const teacherId = z.coerce.number().safeParse(req.params.teacherstudentId);
  if (!teacherId.success)
    return throwExpressException(400, "invalid teacherId", next);

  const teacher = prisma.teacher.findUnique({
    where: { id: teacherId.data },
  });
  if (!teacher) return throwExpressException(404, "teacher not found", next);

  // todo: cascade delete (via db)
  await prisma.teacher.delete({
    where: { id: teacherId.data },
  });
  res.status(200).send();
}
