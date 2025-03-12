import { NextFunction, Request, Response } from "express";
import {ExpressException} from "../../../../exceptions/ExpressException.ts";
import { prisma } from "../../../../index.ts";
import {doesTokenBelongToTeacherInClass, doesTokenBelongToStudentInClass, getJWToken} from "../../../authenticatie/extra_auth_functies.ts";
import {z} from "zod";

const bodyConversatieSchema = z.object({
  leerlingen: z.array(
    z.string().trim().regex(/^\/leerlingen\/\d+$/, "Geen geldige URL, format: /leerlingen/{id}")
  )
});

// GET /klassen/:klas_id/opdrachten/:opdracht_id/groepen
export async function opdrachtGroepen(req: Request, res: Response, next: NextFunction) {
  const classId = z.coerce.number().safeParse(req.params.klas_id);
  const assignmentId = z.coerce.number().safeParse(req.params.opdracht_id);

  if (!classId.success) throw new ExpressException(400, "invalid classId", next);
  if (!assignmentId.success) throw new ExpressException(400, "invalid assignmentId", next);

  // authentication
  const JWToken = getJWToken(req, next);
  const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
  const auth2 = await doesTokenBelongToStudentInClass(classId.data, JWToken);
  if (!(auth1.success || auth2.success))
      throw new ExpressException(403, auth1.errorMessage + " and " + auth2.errorMessage, next);

  const klas = prisma.class.findUnique({
    where: {
      id: classId.data,
    },
  });
  if (klas === null) throw new ExpressException(404, "class not found", next);

  const opdracht = prisma.assignment.findUnique({
    where: {
      id: assignmentId.data,
      class: classId.data
    },
  });
  if (opdracht == null) throw new ExpressException(404, "assignment not found", next);

  const groepen = await prisma.group.findMany({
    where: {
      class: classId.data,
      assignment: assignmentId.data,
    },
    select: {
      id: true,
    },
  });

  let groepen_links = groepen.map(
    (groep: { id: number }) => `/klassen/${classId.data}/opdrachten/${assignmentId.data}/groepen/${groep.id}`
  );
  res.status(200).send({groepen: groepen_links});
}

// POST /klassen/:klas_id/opdrachten/:opdracht_id/groepen
export async function opdrachtMaakGroep(req: Request, res: Response, next: NextFunction) {
  const classId = z.coerce.number().safeParse(req.params.klas_id);
  const assignmentId = z.coerce.number().safeParse(req.params.opdracht_id);

  if (!classId.success) throw new ExpressException(400, "invalid classId", next);
  if (!assignmentId.success) throw new ExpressException(400, "invalid assignmentId", next);

  const bodyResult = bodyConversatieSchema.safeParse(req.body);
  if (!bodyResult.success) throw new ExpressException(400, "wrong body", next);

  // authentication
  const JWToken = getJWToken(req, next);
  const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
  const auth2 = await doesTokenBelongToStudentInClass(classId.data, JWToken);
  if (!(auth1.success || auth2.success))
      throw new ExpressException(403, auth1.errorMessage + " and " + auth2.errorMessage, next);

  const studentUrls: string[] = bodyResult.data.leerlingen;
  const studentIds: number[] = studentUrls.map((url) => {
    const parts = url.split("/");
    return parseInt(parts[parts.length - 1]);
  });

  const klas = prisma.class.findUnique({
    where: {
      id: classId.data,
    },
  });
  if (klas === null) throw new ExpressException(404, "class not found", next);

  const opdracht = prisma.assignment.findUnique({
    where: {
      id: assignmentId.data,
      class: classId.data
    },
  });
  if (opdracht == null) throw new ExpressException(404, "assignment not found", next);

  const newGroup = await prisma.group.create({
    data: {
      assignment: assignmentId.data,
      class: classId.data,
    },
  });

  // leerlingen aan groep toevoegen
  await prisma.studentGroup.createMany({
    data: studentIds.map((studentId) => {
      return {
        students_id: studentId,
        groups_id: newGroup.id,
      }
    })
  });

  res.status(200).send();
}

// DELETE /klassen/:klas_id/opdrachten/:opdracht_id/groepen/:groep_id
export async function opdrachtVerwijderGroep(req: Request, res: Response, next: NextFunction) {
  const classId = z.coerce.number().safeParse(req.params.klas_id);
  const assignmentId = z.coerce.number().safeParse(req.params.opdracht_id);
  const groupId = z.coerce.number().safeParse(req.params.groep_id);

  if (!classId.success) throw new ExpressException(400, "invalid classId", next);
  if (!assignmentId.success) throw new ExpressException(400, "invalid assignmentId", next);
  if (!groupId.success) throw new ExpressException(400, "invalid groupId", next);

  // authentication
  const JWToken = getJWToken(req, next);
  const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
  const auth2 = await doesTokenBelongToStudentInClass(classId.data, JWToken);
  if (!(auth1.success || auth2.success))
      throw new ExpressException(403, auth1.errorMessage + " and " + auth2.errorMessage, next);

  const klas = prisma.class.findUnique({
    where: {
      id: classId.data,
    },
  });
  if (klas === null) throw new ExpressException(404, "class not found", next);

  const opdracht = prisma.assignment.findUnique({
    where: {
      id: assignmentId.data,
      class: classId.data
    },
  });
  if (opdracht == null) throw new ExpressException(404, "assignment not found", next);

  // verwijder alle submissions van de groep voordat je de groep verwijderd
  await prisma.submission.deleteMany({
    where: {
      group: groupId.data,
    },
  });

  // verwijder de conversaties van de groep voorda je de groep verwijderd
  await prisma.conversation.deleteMany({
    where: {
      group: groupId.data, 
    },
  });

  await prisma.group.delete({
    where: {
      id: groupId.data,
      class: classId.data,
      assignment: assignmentId.data,
    },
  });

  res.status(200).send();
}
