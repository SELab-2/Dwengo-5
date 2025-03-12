import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { ExpressException } from "../../../exceptions/ExpressException.ts";
import { prisma, website_base } from "../../../index.ts";
import {
  doesTokenBelongToStudentInClass,
  doesTokenBelongToTeacher,
  doesTokenBelongToTeacherInClass,
  getJWToken,
} from "../../authenticatie/extra_auth_functies.ts";

// GET /klassen/{klas_id}/leerkrachten
export async function klasLeerkrachten(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const classId = z.coerce.number().safeParse(req.params.klas_id);
  if (!classId.success)
    throw new ExpressException(400, "invalid classId", next);

  const classroom = await prisma.class.findUnique({
    where: { id: classId.data },
    include: { classes_teachers: true },
  });
  if (!classroom) throw new ExpressException(404, "class not found", next);

  const token = getJWToken(req, next);
  const auth1 = await doesTokenBelongToTeacherInClass(classId.data, token);
  const auth2 = await doesTokenBelongToStudentInClass(classId.data, token);
  if (!(auth1.success || auth2.success))
    throw new ExpressException(
      403,
      auth1.errorMessage + " and " + auth2.errorMessage,
      next
    );

  const teacherLinks = classroom.classes_teachers.map(
    (teacher) => `/leerkrachten/${teacher.teachers_id}`
  );
  res.status(200).send({leerkrachten: teacherLinks});
}

// POST /klassen/{klas_id}/leerkrachten
export async function voegLeerkrachtToe(req: Request, res: Response) {
  res.status(200).send();
  return;
  //todo: bespreken of dit met wachtij moet of hoe anders enzo kwni
  const classId = z.coerce.number().safeParse(req.params.klas_id);
  const teacherId = z.coerce.number().safeParse(req.params.leerkracht_id);
  if (!classId.success) throw new ExpressException(400, "invalid classId", next);
  if (!teacherId.success) throw new ExpressException(400, "invalid teacherId", next);

  const classroom = await prisma.class.findUnique({
    where: { id: classId.data },
    include: { classes_teachers: true },
  });
  if (!classroom) throw new ExpressException(404, "class not found", next);

  prisma.classTeacher.create({
    data:{
      teachers_id:teacherId.data,
      classes_id:classId.data
    }
  });
  res.status(200).send();
}

// DELETE /klassen/{klas_id}/leerkrachten/{leerkracht_id}
export async function klasVerwijderLeerkracht(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const classId = z.coerce.number().safeParse(req.params.klas_id);
  const teacherId = z.coerce.number().safeParse(req.params.leerkracht_id);
  if (!classId.success)
    throw new ExpressException(400, "invalid classId", next);
  if (!teacherId.success)
    throw new ExpressException(400, "invalid teacherId", next);

  const classroom = await prisma.class.findUnique({
    where: { id: classId.data },
  });
  if (!classroom) throw new ExpressException(404, "class not found", next);

  const token = getJWToken(req, next);
  const auth1 = await doesTokenBelongToTeacher(teacherId.data, token);
  if (!auth1.success) throw new ExpressException(403, auth1.errorMessage, next);

  // todo: hoe doen we het dat als een klas zijn laatste leerkracht
  // todo: verliest, deze ook verwijderd wordt. is dit db of api taak
  await prisma.classTeacher.delete({
    where: {
      classes_id_teachers_id: {
        teachers_id: teacherId.data,
        classes_id: classId.data,
      },
    },
  });
  res.status(200).send();
}
