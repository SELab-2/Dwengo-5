import {PrismaClient} from '@prisma/client';

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
        conversations: conversations
    }
}