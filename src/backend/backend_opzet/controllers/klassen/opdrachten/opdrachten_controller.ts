import {NextFunction, Request, Response} from "express";
import {prisma} from "../../../index.ts";
import {ExpressException} from "../../../exceptions/ExpressException.ts";
import {z} from "zod";

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
      `/klassen/${classId.data}/opdrachten/${assignment.id}`
  );
  res.status(200).send({opdrachten: assignmentLinks});
}

// POST /klassen/:klas_id/opdrachten
export async function maakOpdracht(req: Request, res: Response, next: NextFunction) {
  const classId = z.coerce.number().safeParse(req.params.klas_id);
  if (!classId.success) return new ExpressException(400, "invalid classId", next);

  let leerpad_id =  z.string().safeParse(req.body.learning_path.split('/').pop());
  if (!leerpad_id.success) return new ExpressException(400, "invalid learning_path", next);

  let deadline = z.coerce.date().safeParse(req.body.deadline);
  if (!deadline.success) return new ExpressException(400, "invalid deadline", next);

  let name = z.coerce.string().safeParse(req.body.name);
    if (!name.success) return new ExpressException(400, "invalid name", next);

  const klas = prisma.class.findUnique({
    where: {
      id: classId.data,
    },
  });
  if (klas === null) throw new ExpressException(404, "class not found", next);

  console.log(leerpad_id);

  const leerpad = await prisma.learningPath.findUnique({
    where: {
      uuid: leerpad_id.data,
    },
  });

  if (leerpad === null) {
    throw new ExpressException(400, `learningPath with uuid: ${leerpad_id} does not exist`, next);
  }


  const opdracht = await prisma.assignment.create({
    data: {
      name: name.data,
      learning_path: leerpad_id.data,
      class: classId.data,
      created_at: new Date(),
      deadline: deadline.data,
    },
  });
  res.status(200).send({opdracht: `/klassen/${classId.data}/opdrachten/${opdracht.id}`});
}

// GET /klassen/:klas_id/opdrachten/:opdracht_id
export async function klasOpdracht(req: Request, res: Response, next: NextFunction) {
  const classId = z.coerce.number().safeParse(req.params.klas_id);
  const assignmentId = z.coerce.number().safeParse(req.params.opdracht_id);

  if (!classId.success) throw new ExpressException(400, "invalid classId", next);
  if (!assignmentId.success) throw new ExpressException(400, "invalid assignmentId", next);

  const classroom = await prisma.class.findUnique({
    where: {
      id: classId.data,
    },
  });
  if (classroom === null) throw new ExpressException(404, "class not found", next);

  const assignment = await prisma.assignment.findUnique({
    where: {
      id: assignmentId.data,
      class: classId.data,
    },
  });

  if (assignment === null) throw new ExpressException(404, "assignment not found", next);

  const opdrachtLink =
    `/klassen/${classId}/opdrachten/${assignmentId}`;
  res.status(200).send({
    created_at: assignment.created_at,
    deadline: assignment.deadline,
    learning_path: `/leerpaden/${ assignment.learning_path}`,
    name: assignment.name,
  });
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

  const assignment = await prisma.assignment.findUnique({
    where: {
      id: assignmentId.data,
    },
  });

  if (assignment === null) throw new ExpressException(404, "assignment not found", next);

  await prisma.assignment.delete({
    where: { id: assignmentId.data },
  });
  res.status(200).send();
}
