import {$Enums, PrismaClient} from '@prisma/client';
import {JsonValue} from "@prisma/client/runtime/library";

export type teacher = { teacher: ({ reviewed_submissions: { id: number; group_id: number; assignment_id: number; submission_content: JsonValue; submission_type: $Enums.SubmissionType; learning_path_node_id: number; graded_by: number | null; grade: number; }[]; } & { id: number; })[]; messages: { id: number; content: string; date: Date; user_id: number; conversation_id: number; }[]; classes: { user_id: number; class_id: number; }[]; notifications: { id: number; user_id: number; type: $Enums.NotificationType; read: boolean; }[]; waitingroom_user: { user_id: number; class_id: number; }[]; } & { id: number; username: string; email: string; password: string; created_at: Date; };
export type student = { student: ({ groups: { student_id: number; group_id: number; }[]; student_learning_objects: { student_id: number; learning_object_id: string; }[]; founded_conversations: { id: number; title: string; student_id: number; group_id: number; assignment_id: number; learning_object_id: string; }[]; } & { id: number; })[]; messages: { id: number; content: string; date: Date; user_id: number; conversation_id: number; }[]; classes: { user_id: number; class_id: number; }[]; notifications: { id: number; user_id: number; type: $Enums.NotificationType; read: boolean; }[]; waitingroom_user: { user_id: number; class_id: number; }[]; } & { id: number; username: string; email: string; password: string; created_at: Date; };
const prisma = new PrismaClient();

export async function exportData() {
    const students = await prisma.user.findMany({
        where: {student: {some: {}}},
        include: {
            notifications: true,
            classes: true,
            messages: true,
            waitingroom_user: true,
            student: {
                include: {
                    groups: true,
                    student_learning_objects: true,
                    founded_conversations: true
                }
            }
        }
    });
    const teachers = await prisma.user.findMany({
        where: {student: {some: {}}},
        include: {
            notifications: true,
            classes: true,
            messages: true,
            waitingroom_user: true,
            teacher: {include: {reviewed_submissions: true}}
        }
    });
    const classes = await prisma.class.findMany({
        include: {
            waitingroom_users: true,
            class_users: true,
            assignments: {include: {groups: {include: {group_students: {include: {student: {include: {user: true}}}}}}}}
        }
    });
    const learningObjects = await prisma.learningObject.findMany({
        include: {
            learning_path_nodes: true,
            students: true,
            conversations: true
        }
    });
    const learningPaths = await prisma.learningPath.findMany({
        include: {
            assignments: true,
            learning_path_nodes: {
                include: {
                    outgoing_edges: true,
                    incoming_edges: true,
                    submissions: true
                }
            }
        }
    });
    const conversations = await prisma.conversation.findMany({
        include: {messages: true}
    });
    return {
        students: students,
        teachers: teachers,
        learningObjects: learningObjects,
        learningPaths: learningPaths,
        classes: classes,
        conversations: conversations,
        password_mappings: {"$2a$10$Xj9pdYzG2HLQM8PIfEK6X.3aki1O12suDiPeCHIiz4xy/pFaZAHNm": "test"} as {
            [key: string]: string
        }
    }
}