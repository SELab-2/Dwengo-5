import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { prisma, website_base } from "../../../../index.ts";
import { ExpressException } from "../../../../exceptions/ExpressException.ts";

// GET /leerlingen/:leerling_id/klassen/:klas_id/opdrachten
export async function leerling_opdrachten(
  req: Request,
  res: Response,
  next: NextFunction
) {
  //console.log("geraakt!!!")
  const studentId = z.coerce.number().safeParse(req.params.leerling_id);
  if (!studentId.success)
    throw new ExpressException(400, "invalid studentId", next);

  //console.log(studentId)

  const student = await prisma.student.findUnique({
    where: { id: studentId.data },
  });
  //console.log("student")
  //console.log(student)
  if (!student) throw new ExpressException(404, "student not found", next);

 
  const classId = z.coerce.number().safeParse(req.params.klas_id);
  if (!classId.success)
    throw new ExpressException(400, "Invalid classId", next);


  const klas = await prisma.class.findUnique({
    where: { id: classId.data },
  });

  if (!klas) throw new ExpressException(404, "class not found", next);

  //console.log("classId")
  //console.log(classId)

  const assignments = await prisma.assignment.findMany({
    where: {
      //class: Number(classId), // todo verander het veld class in assignment naar een andere naam want mijn test is hierdoor in de war.
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
  //console.log("assigments")
  //console.log(assignments)
  const assignmentLinks = assignments.map(
    (assignment) => website_base + "/opdrachten/" + assignment.id
  );
  res.status(200).send(assignmentLinks);
}
