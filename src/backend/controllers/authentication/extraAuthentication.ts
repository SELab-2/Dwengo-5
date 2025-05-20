import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET, prisma } from "../../index.ts";
import { NextFunction, Request } from "express";
import { ExpressException } from "../../exceptions/ExpressException.ts";

type authReturnObject = { success: boolean, errorMessage: string, errorCode: number };

export function getJWToken(req: Request, next: NextFunction): string | null {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
        return null;
    const token = authHeader.slice(7); // afsnijden van "Bearer "
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    if (!payload || typeof payload !== "object" || !payload.id)
        return null;
    return token;
}

export async function doesTokenBelongToStudentInGroup(groupId: number, bearerToken: string): Promise<authReturnObject> {
    const payload = jwt.verify(bearerToken, JWT_SECRET) as JwtPayload;
    if (!payload || typeof payload !== "object" || !payload.id) return { success: false, errorMessage: "invalid token", errorCode: 403 };
    const studentId: number = Number(payload.id);
    const group = await prisma.group.findUnique({
        where: { id: groupId },
        include: {
            group_students: {
                where: {
                    student_id: studentId
                }
            }
        }
    });
    if (!group) return { success: false, errorMessage: "group not found", errorCode: 404 };
    return { success: group.group_students.length != 0, errorMessage: "is not student in group", errorCode: 403 };
}

export async function doesTokenBelongToStudentInClass(classId: number, bearerToken: string): Promise<authReturnObject> {
    const payload = jwt.verify(bearerToken, JWT_SECRET) as JwtPayload;
    if (!payload || typeof payload !== "object" || !payload.id) return {
        success: false,
        errorMessage: "invalid token",
        errorCode: 401
    };
    const studentId: number = Number(payload.id);
    const classs = await prisma.class.findUnique({
        where: { id: classId },
        include: {
            class_users: {
                where: {
                    user: {
                        id: studentId,
                        student: {}
                    }
                }
            }
        }
    });
    if (!classs) return { success: false, errorMessage: "class not found", errorCode: 404 };
    return { success: classs.class_users.length != 0, errorMessage: "is not student in class", errorCode: 403 };
}

export async function doesTokenBelongToStudentInAssignment(assignmentId: number, bearerToken: string): Promise<authReturnObject> {
    const payload = jwt.verify(bearerToken, JWT_SECRET) as JwtPayload;
    if (!payload || typeof payload !== "object" || !payload.id) return { success: false, errorMessage: "invalid token", errorCode: 403 };
    const studentId: number = Number(payload.id);
    const classs = await prisma.assignment.findUnique({
        where: { id: assignmentId },
        include: {
            groups: {
                where: {
                    group_students: {
                        some: { student_id: studentId }
                    }
                }
            }
        }
    });
    if (!classs) return { success: false, errorMessage: "class not found", errorCode: 404 };
    return { success: classs.groups.length != 0, errorMessage: "is not student in assignment", errorCode: 403 };
}

export async function doesTokenBelongToTeacherInClass(classId: number, bearerToken: string): Promise<authReturnObject> {
    if (!bearerToken) return { success: false, errorMessage: "no token sent", errorCode: 401 };
    const payload = jwt.verify(bearerToken, JWT_SECRET) as JwtPayload;
    if (!payload || typeof payload !== "object" || !payload.id) return { success: false, errorMessage: "invalid token", errorCode: 403 };
    if (payload.usertype !== "teacher") return { success: false, errorMessage: "not a teacher", errorCode: 403 };
    const teacherId: number = Number(payload.id);
    const classs = await prisma.class.findUnique({
        where: { id: classId },
        include: {
            class_users: {
                where: {
                    user: {
                        id: teacherId,
                        teacher: {}
                    }
                }
            }
        }
    });
    if (!classs) return { success: false, errorMessage: "class not found", errorCode: 404 };
    return { success: classs.class_users.length != 0, errorMessage: "is not teacher in class", errorCode: 403 };
}

export async function doesTokenBelongToTeacher(teacherId: number, bearerToken: string): Promise<authReturnObject> {
    const payload = jwt.verify(bearerToken, JWT_SECRET) as JwtPayload;
    if (!payload || typeof payload !== "object" || !payload.id) return { success: false, errorMessage: "invalid token", errorCode: 403 };
    const teacher = await prisma.teacher.findUnique({
        where: { id: teacherId }
    });
    if (!teacher) return { success: false, errorMessage: "teacher not found", errorCode: 404 };
    return { success: true, errorMessage: "this check passed", errorCode: 200 };//er staat "this check passed" voor als de output van 1 foute en 1 juiste auth functie samengevoegd worden in 1 string
}

export async function doesTokenBelongToStudent(studentId: number, bearerToken: string): Promise<authReturnObject> {
    const payload = jwt.verify(bearerToken, JWT_SECRET) as JwtPayload;
    if (!payload || typeof payload !== "object" || !payload.id) return {
        success: false,
        errorMessage: "invalid token",
        errorCode: 401
    };
    const teacher = await prisma.student.findUnique({
        where: { id: studentId }
    });
    if (!teacher) return { success: false, errorMessage: "student not found", errorCode: 404 };
    return { success: true, errorMessage: "this check passed", errorCode: 200 };
}

export async function doesTokenBelongToUser(userId: number, bearerToken: string): Promise<authReturnObject> {
    const payload = jwt.verify(bearerToken, JWT_SECRET) as JwtPayload;
    if (!payload || typeof payload !== "object" || !payload.id) return {
        success: false,
        errorMessage: "invalid token",
        errorCode: 401
    };
    const teacher = await prisma.user.findUnique({
        where: { id: userId }
    });
    if (!teacher) return { success: false, errorMessage: "student not found", errorCode: 404 };
    return { success: true, errorMessage: "this check passed", errorCode: 200 };
}
