import { NextFunction, Request, Response } from "express";
import {
  doesTokenBelongToTeacherInClass,
  getJWToken,
} from "../../authenticatie/extra_auth_functies.ts";
import { throwExpressException } from "../../../exceptions/ExpressException.ts";
import { z } from "zod";
import { prisma } from "../../../index.ts";

// GET /klassen/:klas_id/conversaties
export async function klasConversaties(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const classId = z.coerce.number().safeParse(req.params.klas_id);
  if (!classId.success)
    return throwExpressException(400, "invalid classId", next);

  // authentication
  const JWToken = getJWToken(req, next);
  const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
  if (!auth1.success) return throwExpressException(403, auth1.errorMessage, next);

  const conversations = await prisma.conversation.findMany({
    where: { assignments: { classes: { id: classId.data } } },
  });
  const conversationLinks = conversations.map(
    (conversation) =>
      `/klassen/${classId.data}/opdrachten/${conversation.assignment}/groepen/${conversation.group}/conversaties/${conversation.id}`
  );
  res.status(200).send({conversaties: conversationLinks});
}
