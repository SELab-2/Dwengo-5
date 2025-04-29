import {$Enums, PrismaClient} from '@prisma/client';
import {JsonValue} from "@prisma/client/runtime/library";
import {expect} from "vitest";

export type teacher = { teacher: ({ reviewed_submissions: { id: number; group_id: number; assignment_id: number; submission_content: JsonValue; submission_type: $Enums.SubmissionType; learning_path_node_id: number; graded_by: number | null; grade: number; }[]; } & { id: number; })[]; messages: { id: number; content: string; date: Date; user_id: number; conversation_id: number; }[]; classes: { user_id: number; class_id: number; class: classroom}[]; notifications: { id: number; user_id: number; type: $Enums.NotificationType; read: boolean; }[]; waitingroom_user: { user_id: number; class_id: number; }[]; } & { id: number; username: string; email: string; password: string; created_at: Date; };
export type student = { student: ({ student_learning_objects: { student_id: number; learning_object_id: string; }[]; founded_conversations: { id: number; title: string; student_id: number; group_id: number; assignment_id: number; learning_object_id: string; }[]; groups: ({ group: { assignment: { id: number; created_at: Date; name: string; class_id: number; deadline: Date | null; learning_path_id: string; }; } & { id: number; name: string; assignment_id: number; }; } & { student_id: number; group_id: number; })[]; } & { id: number; })[]; messages: { id: number; user_id: number; content: string; date: Date; conversation_id: number; }[]; classes: { class_id: number; user_id: number; class: classroom }[]; notifications: { id: number; user_id: number; type: $Enums.NotificationType; read: boolean; }[]; waitingroom_user: { class_id: number; user_id: number; }[]; } & { id: number; username: string; email: string; password: string; created_at: Date; };
export type classroom = { assignments: ({ groups: ({ group_students: ({ student: { user: { id: number; username: string; email: string; password: string; created_at: Date; }; } & { id: number; }; } & { student_id: number; group_id: number; })[]; } & { id: number; name: string; assignment_id: number; })[]; } & { id: number; created_at: Date; name: string; class_id: number; deadline: Date | null; learning_path_id: string; })[]; class_users: ({ user: { student: { id: number; }[]; teacher: { id: number; }[]; } & { id: number; username: string; email: string; password: string; created_at: Date; }; } & { class_id: number; user_id: number; })[]; waitingroom_users: { class_id: number; user_id: number; }[]; } & { id: number; name: string | null; };
export type assignment = { groups: ({ group_students: ({ student: { user: { id: number; username: string; email: string; password: string; created_at: Date; }; } & { id: number; }; } & { student_id: number; group_id: number; })[]; } & { id: number; name: string; assignment_id: number; })[]; } & { id: number; created_at: Date; name: string; class_id: number; deadline: Date | null; learning_path_id: string; };
export type learningPathNode = {id: number; learning_object_id: string; learning_path_id: string; start_node: boolean }
export type learningPath = { hruid: string; id: string; language: string; title: string | null; description: string | null; image: string | null; } & {assignments: assignment[]} & {learning_path_nodes: learningPathNode[]};
export type learningObject = { id: string; hruid: string; uuid: string; language: string; version: string; html_content: string; title: string | null; description: string | null; content_type: $Enums.ContentType | null; keywords: string[]; target_ages: number[]; teacher_exclusive: boolean; skos_concepts: string[]; educatioanl_goals: JsonValue | null; copyright: string | null; license: string | null; difficulty: number; estimated_time: number; return_value: JsonValue | null; available: boolean; content_location: string } & { conversations: { id: number; title: string; student_id: number; group_id: number; assignment_id: number; learning_object_id: string }[] } & { students: { student_id: number, learning_object_id:string }[] } & { learning_path_nodes:{id:number, learning_object_id:string, learning_path_id:string, start_node:boolean}[]};

const prisma = new PrismaClient();

export async function getDbData() {
    const students = await prisma.user.findMany({
        where: {student: {some: {}}},
        include: {
            notifications: true,
            classes: {
                include: {
                    class: true
                }
            },
            messages: true,
            waitingroom_user: true,
            student: {
                include: {
                    groups: {
                        include:{
                            group: {
                                include:{
                                    assignment:true
                                }
                            }
                        }
                    },
                    student_learning_objects: true,
                    founded_conversations: true
                }
            }
        }
    });
    const teachers = await prisma.user.findMany({
        where: {teacher: {some: {}}},
        include: {
            notifications: true,
            classes: {
                include: {
                    class: {
                        include: {
                            waitingroom_users: true,
                            class_users: true
                        }
                    }
                }
            },
            messages: true,
            waitingroom_user: true,
            teacher: {include: {reviewed_submissions: true}}
        }
    });
    const classes = await prisma.class.findMany({
        include: {
            waitingroom_users: true,
            class_users: {
                include: {
                    user: {
                        include:{
                            student:true,
                            teacher:true
                        }
                    }}},
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