import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../../index.ts";
import { z } from "zod";
import { ExpressException } from "../../../../exceptions/ExpressException.ts";
import {
  doesTokenBelongToTeacherInClass,
  getJWToken,
} from "../../../authenticatie/extra_auth_functies.ts";

// GET /klassen/:klas_id/opdrachten/:opdracht_id/conversaties
export async function opdrachtConversaties(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const classId = z.coerce.number().safeParse(req.params.klas_id);
  const assignmentId = z.coerce.number().safeParse(req.params.opdracht_id);
  if (!classId.success)
    throw new ExpressException(400, "invalid classId", next);
  if (!assignmentId.success)
    throw new ExpressException(400, "invalid assignmentId", next);

  // authentication
  const JWToken = getJWToken(req, next);
  const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
  if (!auth1.success) throw new ExpressException(403, auth1.errorMessage, next);

  const assingment = await prisma.assignment.findUnique({
      where: {
          id: assignmentId.data, 
          classes: {id: classId.data}
      }
  });
  if (!assingment) throw new ExpressException(404, "assignment not found", next);

  const conversations = await prisma.conversation.findMany({
      where: {
          assignment: assignmentId.data
      }
  });
  const conversationLinks = conversations.map((conversatie) =>
      `/klassen/${classId.data}/opdrachten/${assignmentId.data}/groepen/${conversatie.group}/conversaties/${conversatie.id}`
  );
  res.status(200).send({conversaties: conversationLinks});
}
