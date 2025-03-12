import { NextFunction, Request, Response } from "express";
import { website_base, prisma } from "../../../../../index.ts";
import { z } from "zod";
import { ExpressException } from "../../../../../exceptions/ExpressException.ts";

const bodySchema = z.object({
  leerling: z.string().regex(/^\/leerlingen\/\d+$/),
});

// todo: authentication

// GET /klassen/:klas_id/opdrachten/:opdracht_id/groepen/:groep_id/leerlingen
export async function groepLeerlingen(req: Request, res: Response, next: NextFunction) {
  const classId = z.coerce.number().safeParse(req.params.klas_id);
  const assignmentId = z.coerce.number().safeParse(req.params.opdracht_id);
  const groupId = z.coerce.number().safeParse(req.params.groep_id);

  if (!classId.success) throw new ExpressException(400, "invalid classId", next);
  if (!assignmentId.success) throw new ExpressException(400, "invalid assignmentId", next);
  if (!groupId.success) throw new ExpressException(400, "invalid groupId", next);

  const group = await prisma.group.findFirst({
    where: {
      id: groupId.data,
      class: classId.data,
      assignment: assignmentId.data,
    },
  });
  if (!group) throw new ExpressException(404, "group not found", next);

  // todo moet nog met opdracht_id werken hier
  const students = await prisma.student.findMany({
    where: {
      classes_students: {
        some: {
          classes_id: classId.data,
        },
      },
      students_groups: {
        some: {
          groups_id: groupId.data,
        },
      },
    },
  });

  let studentLinks = students.map(
    (student: { id: number }) =>
      `/leerlingen/${student.id}`
  );
  res.status(200).send({leerlingen: studentLinks});
}

// POST /klassen/:klas_id/opdrachten/:opdracht_id/groepen/:groep_id/leerlingen
export async function groepVoegLeerlingToe(req: Request, res: Response, next: NextFunction) {
  const classId = z.coerce.number().safeParse(req.params.klas_id);
  const assignmentId = z.coerce.number().safeParse(req.params.opdracht_id);
  const groupId = z.coerce.number().safeParse(req.params.groep_id);

  if (!classId.success) throw new ExpressException(400, "invalid classId", next);
  if (!assignmentId.success) throw new ExpressException(400, "invalid assignmentId", next);
  if (!groupId.success) throw new ExpressException(400, "invalid groupId", next);

  const bodyResult = bodySchema.safeParse(req.body);
  if (!bodyResult.success) throw new ExpressException(400, "invalid body", next);

  const studentUrl: string = bodyResult.data.leerling;
  const studentId: number = Number(studentUrl.split("/").pop());

  const group = await prisma.group.findFirst({
    where: {
      id: groupId.data,
      class: classId.data,
      assignment: assignmentId.data,
    },
  });
  if (!group) throw new ExpressException(404, "group not found", next);

  // controlleer of student bestaat
  const student = await prisma.student.findUnique({
    where: {
      id: studentId,
    },
  });
  if (!student) throw new ExpressException(404, "student not found", next);

  // TODO: controleren of dit juist is
  await prisma.studentGroup.create({
    data: {
      students_id: studentId,
      groups_id: groupId.data,
    },
  });
  res.status(200).send();
}

// DELETE /klassen/:klas_id/opdrachten/:opdracht_id/groepen/:groep_id/leerlingen/:leerling_id
export async function groepVerwijderLeerling(req: Request, res: Response, next: NextFunction) {
  const classId = z.coerce.number().safeParse(req.params.klas_id);
  const assignmentId = z.coerce.number().safeParse(req.params.opdracht_id);
  const groupId = z.coerce.number().safeParse(req.params.groep_id);
  const studentId = z.coerce.number().safeParse(req.params.leerling_id);

  if (!classId.success) throw new ExpressException(400, "invalid classId", next);
  if (!assignmentId.success) throw new ExpressException(400, "invalid assignmentId", next);
  if (!groupId.success) throw new ExpressException(400, "invalid groupId", next);
  if (!studentId.success) throw new ExpressException(400, "invalid studentId", next);

  const group = await prisma.group.findFirst({
    where: {
      id: groupId.data,
      class: classId.data,
      assignment: assignmentId.data,
    },
  });
  if (!group) throw new ExpressException(404, "group not found", next);

  // controlleer of student bestaat
  const student = await prisma.student.findUnique({
    where: {
      id: studentId.data,
    },
  });
  if (!student) throw new ExpressException(404, "student not found", next);

  // controlleer of student in groep zit
  const studentGroup = await prisma.studentGroup.findFirst({
    where: {
      students_id: studentId.data,
      groups_id: groupId.data,
    },
  });
  if (!studentGroup) throw new ExpressException(404, "student not in group", next);

  // verwijder student uit groep
  await prisma.studentGroup.delete({
    where: {
      students_id_groups_id: {
        students_id: studentId.data,
        groups_id: groupId.data,
      },
    },
  });
  res.status(200).send();
}
