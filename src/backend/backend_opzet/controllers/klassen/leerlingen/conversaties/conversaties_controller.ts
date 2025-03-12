import { NextFunction, Request, Response } from "express";
import { prisma, website_base } from "../../../../index.ts";
import { z } from "zod";
import { ExpressException } from "../../../../exceptions/ExpressException.ts";

// GET /klassen/{klas_id}/leerlingen/{leerling_id}/conversaties
export async function leerlingConversaties(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const classId = z.coerce.number().safeParse(req.params.klas_id);
  const studentId = z.coerce.number().safeParse(req.params.leerling_id);
  if (!classId.success)
    throw new ExpressException(400, "invalid classId", next);
  if (!studentId.success)
    throw new ExpressException(400, "invalid studentId", next);

  const classroom = await prisma.class.findUnique({
    where: { id: classId.data },
  });
  if (!classroom) throw new ExpressException(404, "class not found", next);

  const student = await prisma.student.findUnique({
    where: { id: studentId.data },
  });
  if (!student) throw new ExpressException(404, "student not found", next);

  const conversations = await prisma.conversation.findMany({
    where: {
      groups: { students_groups: { some: { students_id: studentId.data } } },
    },
  });
  const conversationsLinks = conversations.map(
    (conversation) =>
      website_base +
      `/klassen/${classId.data}/opdrachten/${conversation.assignment}/groepen/${conversation.group}/conversaties/${conversation.id}`
  );
  res.status(200).send({conversaties: conversationsLinks});
}
