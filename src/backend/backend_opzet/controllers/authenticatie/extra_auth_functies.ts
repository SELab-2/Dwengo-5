import jwt, {JwtPayload} from "jsonwebtoken";
import {JWT_SECRET, prisma} from "../../index.ts";

export async function isLoggedInGroup(groupId: number, bearerToken: string): Promise<[Boolean, String]> {
    const token = bearerToken.slice(7); // afsnijden van "Bearer "
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    if (!payload || typeof payload !== "object" || !payload.id) return [false, "invalid token"];
    let studentId: number = Number(payload.id);
    let group = await prisma.group.findUnique({
        where: {id: groupId},
        include: {
            students_groups: {
                where: {
                    students_id: studentId
                },
            }
        }
    });
    if (!group) return [false, "group not found"];
    return [group.students_groups.length != 0, "student not in group"];
}

export async function studentIsLoggedInClass(classId: number, bearerToken: string): Promise<[Boolean, String]> {
    const token = bearerToken.slice(7); // afsnijden van "Bearer "
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    if (!payload || typeof payload !== "object" || !payload.id) return [false, "invalid token"];
    let studentId: number = Number(payload.id);
    let classs = await prisma.class.findUnique({
        where: {id: classId},
        include: {
            classes_students: {
                where: {
                    students_id: studentId
                },
            }
        }
    });
    if (!classs) return [false, "class not found"];
    return [classs.classes_students.length != 0, "student not in class"];
}

export async function teacherIsLoggedInClass(classId: number, bearerToken: string): Promise<[Boolean, String]> {
    const token = bearerToken.slice(7); // afsnijden van "Bearer "
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    if (!payload || typeof payload !== "object" || !payload.id) return [false, "invalid token"];
    let teacherId: number = Number(payload.id);
    let classs = await prisma.class.findUnique({
        where: {id: classId},
        include: {
            classes_teachers: {
                where: {
                    teachers_id: teacherId
                },
            }
        }
    });
    if (!classs) return [false, "class not found"];
    return [classs.classes_teachers.length != 0, "teacher not in class"];
}
