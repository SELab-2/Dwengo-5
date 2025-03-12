import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../../index.ts";
import { ExpressException } from "../../exceptions/ExpressException.ts";

export async function leerkracht(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const teacherId = z.coerce.number().safeParse(req.params.leerkracht_id);
  if (!teacherId.success)
    throw new ExpressException(400, "invalid teacherId", next);

  const teacher = await prisma.teacher.findUnique({
    where: {
      id: teacherId.data,
    },
  });
  if (!teacher) throw new ExpressException(404, "teacher not found", next);

  res.status(200).send({ name: teacher.username });
}

export async function verwijder_leerkracht(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const teacherId = z.coerce.number().safeParse(req.params.leerkracht_id);
  if (!teacherId.success)
    throw new ExpressException(400, "invalid teacherId", next);

  const teacher = prisma.teacher.findUnique({
    where: { id: teacherId.data },
  });
  if (!teacher) throw new ExpressException(404, "teacher doesn't exist", next);

  await prisma.teacher.delete({
    where: { id: teacherId.data },
  });
  res.status(200).send();
}
