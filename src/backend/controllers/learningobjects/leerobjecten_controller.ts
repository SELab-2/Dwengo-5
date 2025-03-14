import { NextFunction, Request, Response } from "express";
import { prisma } from "../../index.ts";
import { throwExpressException } from "../../exceptions/ExpressException.ts";

// GET /learningobjects/:leerobjectid
export async function leerobject(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const learningObjectId: string = req.params.learningObjectId;
  const learningObject = await prisma.learningObject.findUnique({
    where: {
      id: learningObjectId,
    },
  });
  if (!learningObject)
    return throwExpressException(404, "learningObject not found", next);

  res.status(200).send({
    name: learningObject.hruid,
    estimated_time: 0,
    content: `/leerobjecten/${learningObjectId}/content`,
  });
}

// GET /leerobjeten/:learningObjectId/content
export async function leerobjectcontent(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const learningObjectId: string = req.params.learningObjectId;
  const learningObject = await prisma.learningObject.findUnique({
    where: {
      id: learningObjectId,
    },
  });
  if (!learningObject)
    return throwExpressException(404, "learningObject not found", next);

  res.status(200).send({ htmlContent: learningObject.html_content });
}
