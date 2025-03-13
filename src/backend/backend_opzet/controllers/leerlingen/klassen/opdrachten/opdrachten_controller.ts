import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../../../../index.ts";
import { ExpressException } from "../../../../exceptions/ExpressException.ts";

// GET /leerlingen/:leerling_id/klassen/:klas_id/opdrachten
export async function leerlingOpdrachten(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const studentId = z.coerce.number().safeParse(req.params.leerling_id);
  if (!studentId.success)
    throw new ExpressException(400, "invalid studentId", next);

  const student = await prisma.student.findUnique({
    where: { id: studentId.data },
  });
  if (!student) throw new ExpressException(404, "student not found", next);

 
  const classId = z.coerce.number().safeParse(req.params.klas_id);
  if (!classId.success)
    throw new ExpressException(400, "Invalid classId", next);


  const klas = await prisma.class.findUnique({
    where: { id: classId.data },
  });

  if (!klas) throw new ExpressException(404, "class not found", next);

  const assignments = await prisma.assignment.findMany({
    where: {
      class: classId.data,
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
  res.status(200).send({opdrachten: assignmentLinks});
}
