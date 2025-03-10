import { NextFunction, Request, Response } from "express";
import { prisma, website_base } from "../../../index.ts";
import { z } from "zod";
import { ExpressException } from "../../../exceptions/ExpressException.ts";

export async function leerkracht_klassen(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const teacherId = z.coerce.number().safeParse(req.params.leerkracht_id);
  if (!teacherId.success)
    throw new ExpressException(400, "invalid teacherId", next);

  const leerkracht = await prisma.teacher.findUnique({
    where: { id: teacherId.data },
  });
  if (!leerkracht) throw new ExpressException(404, "teacher not found", next);

  const klassen = await prisma.classTeacher.findMany({
    where: { teachers_id: teacherId.data },
  });
  const klassen_links = klassen.map(
    (klas) => website_base + "/klassen/" + klas.classes_id
  );
  res.status(200).send(klassen_links);
}
