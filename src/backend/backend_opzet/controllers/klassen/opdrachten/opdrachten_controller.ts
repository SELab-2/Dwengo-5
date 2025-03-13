import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../index.ts";
import { ExpressException } from "../../../exceptions/ExpressException.ts";
import { z } from "zod";

// GET: /klassen/:klas_id/opdrachten
export async function klasOpdrachten(req: Request, res: Response, next: NextFunction) {
  const classId = z.coerce.number().safeParse(req.params.klas_id);
  if (!classId.success) throw new ExpressException(400, "invalid classId", next);

  const klas = prisma.class.findUnique({
    where: {
      id: classId.data,
    },
  });

  if (klas === null) throw new ExpressException(404, "class not found", next);

  const assignments = await prisma.assignment.findMany({
    where: {
      class: classId.data,
    },
  });

  const assignmentLinks = assignments.map(
    (assignment: { learning_path: string, id: number }) =>
      `/klassen/${classId}/opdrachten/${assignment.id}`
  );
  res.status(200).send({opdrachten: assignmentLinks});
}

// POST /klassen/:klas_id/opdrachten
export async function maakOpdracht(req: Request, res: Response, next: NextFunction) {
  const classId = z.coerce.number().safeParse(req.params.klas_id);
  if (!classId.success) throw new ExpressException(400, "invalid classId", next);

  let leerpad_id_string: string = req.body.leerpad_id;
  let leerpad_id: string = leerpad_id_string;

  const klas = prisma.class.findUnique({
    where: {
      id: classId.data,
    },
  });
  if (klas === null) throw new ExpressException(404, "class not found", next);

  await prisma.assignment.create({
    data: {
      name: "opdracht", // todo: name uit req body halen
      learning_path: leerpad_id,
      class: classId.data,
      created_at: new Date(),
    },
  });
  res.status(200).send();
}

// GET /klassen/:klas_id/opdrachten/:opdracht_id
export async function klasOpdracht(req: Request, res: Response, next: NextFunction) {
  const classId = z.coerce.number().safeParse(req.params.klas_id);
  const assignmentId = z.coerce.number().safeParse(req.params.opdracht_id);

  if (!classId.success) throw new ExpressException(400, "invalid classId", next);
  if (!assignmentId.success) throw new ExpressException(400, "invalid assignmentId", next);

  const klas = prisma.class.findUnique({
    where: {
      id: classId.data,
    },
  });
  if (klas === null) throw new ExpressException(404, "class not found", next);

  const opdracht = prisma.assignment.findUnique({
    where: {
      id: assignmentId.data,
      class: classId.data,
    },
    include: {
      learning_paths: true,
    },
  });

  const leerpad_link =
    `/leerpaden/${opdracht.learning_paths}`;
  res.status(200).send({leerpad: leerpad_link});
}

// DELETE /klassen/:klas_id/opdrachten/:opdracht_id
export async function verwijderOpdracht(req: Request, res: Response, next: NextFunction) {
  const classId = z.coerce.number().safeParse(req.params.klas_id);
  const assignmentId = z.coerce.number().safeParse(req.params.opdracht_id);

  if (!classId.success) throw new ExpressException(400, "invalid classId", next);
  if (!assignmentId.success) throw new ExpressException(400, "invalid assignmentId", next);

  const klas = prisma.class.findUnique({
    where: {
      id: classId.data,
    },
  });
  if (klas === null) throw new ExpressException(404, "class not found", next);

  await prisma.class.update({
    where: { id: classId.data },
    data: {
      assignments: {
        disconnect: { id: assignmentId.data },
      },
    },
  });
  res.status(200).send();
}
