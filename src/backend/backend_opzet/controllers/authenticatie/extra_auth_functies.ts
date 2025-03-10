import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET, prisma } from "../../index.ts";
import { NextFunction, Request } from "express";
import { ExpressException } from "../../exceptions/ExpressException.ts";

export function getJWToken(req: Request, next: NextFunction): string {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer "))
    throw new ExpressException(401, "no token sent", next);
  const token = authHeader.slice(7); // afsnijden van "Bearer "
  const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
  if (!payload || typeof payload !== "object" || !payload.id)
    throw new ExpressException(401, "invalid token", next);
  return token;
}

export async function doesTokenBelongToStudentInGroup(
  groupId: number,
  bearerToken: string
): Promise<{
  success: boolean;
  errorMessage: string;
}> {
  const token = bearerToken.slice(7); // afsnijden van "Bearer "
  const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
  if (!payload || typeof payload !== "object" || !payload.id)
    return { success: false, errorMessage: "invalid token" };
  const studentId: number = Number(payload.id);
  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: {
      students_groups: {
        where: {
          students_id: studentId,
        },
      },
    },
  });
  if (!group) return { success: false, errorMessage: "group not found" };
  return {
    success: group.students_groups.length != 0,
    errorMessage: "is not student in group",
  };
}

export async function doesTokenBelongToStudentInClass(
  classId: number,
  bearerToken: string
): Promise<{
  success: boolean;
  errorMessage: string;
}> {
  const token = bearerToken.slice(7); // afsnijden van "Bearer "
  const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
  if (!payload || typeof payload !== "object" || !payload.id)
    return { success: false, errorMessage: "invalid token" };
  const studentId: number = Number(payload.id);
  const classs = await prisma.class.findUnique({
    where: { id: classId },
    include: {
      classes_students: {
        where: {
          students_id: studentId,
        },
      },
    },
  });
  if (!classs) return { success: false, errorMessage: "class not found" };
  return {
    success: classs.classes_students.length != 0,
    errorMessage: "is not student in class",
  };
}

export async function doesTokenBelongToTeacherInClass(
  classId: number,
  bearerToken: string
): Promise<{
  success: boolean;
  errorMessage: string;
}> {
  const token = bearerToken.slice(7); // afsnijden van "Bearer "
  const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
  if (!payload || typeof payload !== "object" || !payload.id)
    return { success: false, errorMessage: "invalid token" };
  const teacherId: number = Number(payload.id);
  const classs = await prisma.class.findUnique({
    where: { id: classId },
    include: {
      classes_teachers: {
        where: {
          teachers_id: teacherId,
        },
      },
    },
  });
  if (!classs) return { success: false, errorMessage: "class not found" };
  return {
    success: classs.classes_teachers.length != 0,
    errorMessage: "is not teacher in class",
  };
}

export async function doesTokenBelongToTeacher(
  teacherId: number,
  bearerToken: string
): Promise<{
  success: boolean;
  errorMessage: string;
}> {
  const token = bearerToken.slice(7); // afsnijden van "Bearer "
  const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
  if (!payload || typeof payload !== "object" || !payload.id)
    return { success: false, errorMessage: "invalid token" };
  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
  });
  if (!teacher) return { success: false, errorMessage: "teacher not found" };
  return { success: true, errorMessage: "" };
}
