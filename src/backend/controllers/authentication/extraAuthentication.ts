import jwt, {JwtPayload} from "jsonwebtoken";
import {JWT_SECRET, prisma} from "../../index.ts";
import {NextFunction, Request} from "express";
import {ExpressException} from "../../exceptions/ExpressException.ts";

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

export async function doesTokenBelongToStudentInGroup(groupId: number, bearerToken: string) {
    const payload = jwt.verify(bearerToken, JWT_SECRET) as JwtPayload;
    if (!payload || typeof payload !== "object" || !payload.id) return {success: false, errorMessage: "invalid token"};
    const studentId: number = Number(payload.id);
    const group = await prisma.group.findUnique({
        where: {id: groupId},
        include: {
            students_groups: {
                where: {
                    students_id: studentId
                },
            }
        }
    });
    if (!group) return {success: false, errorMessage: "group not found"};
    return {success: group.students_groups.length != 0, errorMessage: "is not student in group"};
}

/**
 * checks if a student is a part of the class, represented by the classId, and if the student is
 * part of a group together with another(or the same) student, represented by the otherStudentId
 * @param classId id of the class
 * @param otherStudentId id of the other student(or the same, this doesn't matter)
 * @param bearerToken the bearer token
 * @return {success, errorMessage}
 */
export async function doesTokenBelongToStudentInClassAndInGroupWithStudent(classId: number, otherStudentId: number, bearerToken: string) {
    const payload = jwt.verify(bearerToken, JWT_SECRET) as JwtPayload;
    if (!payload || typeof payload !== "object" || !payload.id) return {success: false, errorMessage: "invalid token"};
    const studentId: number = Number(payload.id);
    const group = await prisma.student.findUnique({
        where: {id: studentId},
        include: {
            classes_students: {
                where: {classes_id: classId}
            },
            students_groups: {
                where: {
                    students_id: studentId
                },
            }
        }
    });
    if (!group) return {success: false, errorMessage: "group not found"};
    if (group.classes_students.length == 0) return {success: false, errorMessage: "student not in class"};
    return {success: group.students_groups.length != 0, errorMessage: "is not student in group"};
}

export async function doesTokenBelongToStudentInClass(classId: number, bearerToken: string) {
    const payload = jwt.verify(bearerToken, JWT_SECRET) as JwtPayload;
    if (!payload || typeof payload !== "object" || !payload.id) return {success: false, errorMessage: "invalid token"};
    const studentId: number = Number(payload.id);
    const classs = await prisma.class.findUnique({
        where: {id: classId},
        include: {
            classes_students: {
                where: {
                    students_id: studentId
                },
            }
        }
    });
    if (!classs) return {success: false, errorMessage: "class not found"};
    return {success: classs.classes_students.length != 0, errorMessage: "is not student in class"};
}

export async function doesTokenBelongToStudentInAssignment(assignmentId: number, bearerToken: string) {
    const payload = jwt.verify(bearerToken, JWT_SECRET) as JwtPayload;
    if (!payload || typeof payload !== "object" || !payload.id) return {success: false, errorMessage: "invalid token"};
    const studentId: number = Number(payload.id);
    const classs = await prisma.assignment.findUnique({
        where: {id: assignmentId},
        include: {
            groups: {
                where: {
                    students_groups: {
                        some: {students_id: studentId}
                    }
                }
            }
        }
    });
    if (!classs) return {success: false, errorMessage: "class not found"};
    return {success: classs.groups.length != 0, errorMessage: "is not student in assignment"};
}

export async function doesTokenBelongToTeacherInClass(
    classId: number,
    bearerToken: string
): Promise<{
    success: boolean;
    errorMessage: string;
}> {
    const payload = jwt.verify(bearerToken, JWT_SECRET) as JwtPayload;
    if (!payload || typeof payload !== "object" || !payload.id) return {success: false, errorMessage: "invalid token"};
    if (payload.usertype !== "teacher") return {success: false, errorMessage: "not a teacher"};
    const teacherId: number = Number(payload.id);
    const classs = await prisma.class.findUnique({
        where: {id: classId},
        include: {
            classes_teachers: {
                where: {
                    teachers_id: teacherId
                },
            }
        }
    });
    if (!classs) return {success: false, errorMessage: "class not found"};
    console.log(payload)
    return {success: classs.classes_teachers.length != 0, errorMessage: "is not teacher in class"};
}

export async function doesTokenBelongToTeacher(teacherId: number, bearerToken: string) {
    const payload = jwt.verify(bearerToken, JWT_SECRET) as JwtPayload;
    if (!payload || typeof payload !== "object" || !payload.id) return {success: false, errorMessage: "invalid token"};
    const teacher = await prisma.teacher.findUnique({
        where: {id: teacherId},
    });
    if (!teacher) return {success: false, errorMessage: "teacher not found"};
    return {success: true, errorMessage: ""};
}

export async function doesTokenBelongToStudent(studentId: number, bearerToken: string) {
    const payload = jwt.verify(bearerToken, JWT_SECRET) as JwtPayload;
    if (!payload || typeof payload !== "object" || !payload.id) return {
        success: false,
        errorMessage: "invalid token",
        errorCode: 401
    };
    const student = await prisma.student.findUnique({
        where: {id: studentId},
    });
    if (!student) return {success: false, errorMessage: "student not found", errorCode: 404};
    return {success: true, errorMessage: "this check passed", errorCode: 200};
}
