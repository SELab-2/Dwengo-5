import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../../../index.ts";
import { z } from "zod";
import { throwExpressException } from "../../../../../exceptions/ExpressException.ts";
import {doesTokenBelongToTeacherInClass, doesTokenBelongToStudentInClass, getJWToken} from "../../../../authenticatie/extra_auth_functies.ts";


const bodySchema = z.object({
  leerling: z.string().regex(/^\/leerlingen\/\d+$/),
});

// GET /klassen/:klas_id/opdrachten/:opdracht_id/groepen/:groep_id/leerlingen
export async function groepLeerlingen(req: Request, res: Response, next: NextFunction) {
  const classId = z.coerce.number().safeParse(req.params.klas_id);
  const assignmentId = z.coerce.number().safeParse(req.params.opdracht_id);
  const groupId = z.coerce.number().safeParse(req.params.groep_id);

  if (!classId.success) return throwExpressException(400, "invalid classId", next);
  if (!assignmentId.success) return throwExpressException(400, "invalid assignmentId", next);
  if (!groupId.success) return throwExpressException(400, "invalid groupId", next);

  // authentication
  const JWToken = getJWToken(req, next);
  const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
  const auth2 = await doesTokenBelongToStudentInClass(classId.data, JWToken);
  if (!(auth1.success || auth2.success))
      return throwExpressException(403, auth1.errorMessage + " and " + auth2.errorMessage, next);

  const group = await prisma.group.findFirst({
    where: {
      id: groupId.data,
      class: classId.data,
      assignment: assignmentId.data,
    },
  });
  if (!group) return throwExpressException(404, "group not found", next);

  const students = await prisma.student.findMany({
    where: {
      classes_students: {
        some: {
          classes_id: classId.data,
        },
      },
      students_groups: {
        some: {
          groups: {
            assignments: {
              id: assignmentId.data,
            },
          },
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

  if (!classId.success) return throwExpressException(400, "invalid classId", next);
  if (!assignmentId.success) return throwExpressException(400, "invalid assignmentId", next);
  if (!groupId.success) return throwExpressException(400, "invalid groupId", next);

  const bodyResult = bodySchema.safeParse(req.body);
  if (!bodyResult.success) return throwExpressException(400, "invalid body", next);

  const studentUrl: string = bodyResult.data.leerling;
  const studentId: number = Number(studentUrl.split("/").pop());

  // authentication
  const JWToken = getJWToken(req, next);
  const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
  const auth2 = await doesTokenBelongToStudentInClass(classId.data, JWToken);
  if (!(auth1.success || auth2.success))
      return throwExpressException(403, auth1.errorMessage + " and " + auth2.errorMessage, next);

  const group = await prisma.group.findFirst({
    where: {
      id: groupId.data,
      class: classId.data,
      assignment: assignmentId.data,
    },
  });
  if (!group) return throwExpressException(404, "group not found", next);

  // controlleer of student bestaat
  const student = await prisma.student.findUnique({
    where: {
      id: studentId,
    },
  });
  if (!student) return throwExpressException(404, "student not found", next);

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

  if (!classId.success) return throwExpressException(400, "invalid classId", next);
  if (!assignmentId.success) return throwExpressException(400, "invalid assignmentId", next);
  if (!groupId.success) return throwExpressException(400, "invalid groupId", next);
  if (!studentId.success) return throwExpressException(400, "invalid studentId", next);

  // authentication
  const JWToken = getJWToken(req, next);
  const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
  const auth2 = await doesTokenBelongToStudentInClass(classId.data, JWToken);
  if (!(auth1.success || auth2.success))
      return throwExpressException(403, auth1.errorMessage + " and " + auth2.errorMessage, next);

  const group = await prisma.group.findFirst({
    where: {
      id: groupId.data,
      class: classId.data,
      assignment: assignmentId.data,
    },
  });
  if (!group) return throwExpressException(404, "group not found", next);

  // controlleer of student bestaat
  const student = await prisma.student.findUnique({
    where: {
      id: studentId.data,
    },
  });
  if (!student) return throwExpressException(404, "student not found", next);

  // controlleer of student in groep zit
  const studentGroup = await prisma.studentGroup.findFirst({
    where: {
      students_id: studentId.data,
      groups_id: groupId.data,
    },
  });
  if (!studentGroup) return throwExpressException(404, "student not in group", next);

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
