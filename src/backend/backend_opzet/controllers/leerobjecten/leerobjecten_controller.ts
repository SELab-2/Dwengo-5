import { NextFunction, Request, Response } from "express";
import { prisma } from "../../index.ts";
import { ExpressException } from "../../exceptions/ExpressException.ts";

// GET /leerobjecten/:leerobjectid
export async function leerobject(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const learningObjectId: string = req.params.leerobject_id;
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
    content: `/leerobjecten/${learningObjectId}/inhoud`,
  });
}

// GET /leerobjeten/:leerobject_id/inhoud
export async function leerobjectInhoud(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const learningObjectId: string = req.params.leerobject_id;
  const learningObject = await prisma.learningObject.findUnique({
    where: {
      id: learningObjectId,
    },
  });
  if (!learningObject)
    return throwExpressException(404, "learningObject not found", next);

  res.status(200).send({ htmlContent: learningObject.html_content });
}
