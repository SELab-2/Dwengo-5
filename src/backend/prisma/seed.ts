import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export const physicsPathUuid = "550e8400-e29b-41d4-a716-446655440001";
export const mathPathUuid = "550e8400-e29b-41d4-a716-446655440000";

async function main() {
    console.log('🌱 Seeding database...');

    const teacher1 = await prisma.teacher.upsert({
        where: {email: 'teacher1@example.com'},
        update: {},
        create: {
            username: 'teacher_one',
            email: 'teacher1@example.com',
            password: '$2a$10$Xj9pdYzG2HLQM8PIfEK6X.3aki1O12suDiPeCHIiz4xy/pFaZAHNm', // plaintext wachtwoord = "test"

            created_at: new Date(),
        },
    });

    const teacher2 = await prisma.teacher.upsert({
        where: {email: 'teacher2@example.com'},
        update: {},
        create: {
            username: 'teacher_two',
            email: 'teacher2@example.com',
            password: '$2a$10$Xj9pdYzG2HLQM8PIfEK6X.3aki1O12suDiPeCHIiz4xy/pFaZAHNm', // plaintext wachtwoord = "test"

            created_at: new Date(),
        },
    });

    const teacher3 = await prisma.teacher.upsert({
        where: {email: 'teacher3@example.com'},
        update: {},
        create: {
            username: 'teacher_three',
            email: 'teacher3@example.com',
            password: '$2a$10$Xj9pdYzG2HLQM8PIfEK6X.3aki1O12suDiPeCHIiz4xy/pFaZAHNm', // plaintext wachtwoord = "test"
            created_at: new Date(),
        },
    });

    // Create multiple students
    const student1 = await prisma.student.upsert({
        where: {email: 'student1@example.com'},
        update: {},
        create: {
            username: 'student_one',
            email: 'student1@example.com',
            password: '$2a$10$Xj9pdYzG2HLQM8PIfEK6X.3aki1O12suDiPeCHIiz4xy/pFaZAHNm', // plaintext wachtwoord = "test"

            created_at: new Date(),
        },
    });

    const student2 = await prisma.student.upsert({
        where: {email: 'student2@example.com'},
        update: {},
        create: {
            username: 'student_two',
            email: 'student2@example.com',
            password: '$2a$10$Xj9pdYzG2HLQM8PIfEK6X.3aki1O12suDiPeCHIiz4xy/pFaZAHNm', // plaintext wachtwoord = "test"

            created_at: new Date(),
        },
    });

    const student5 = await prisma.student.upsert({
        where: {email: 'student5@example.com'},
        update: {},
        create: {
            username: 'student_five',
            email: 'student5@example.com',
            password: '$2a$10$Xj9pdYzG2HLQM8PIfEK6X.3aki1O12suDiPeCHIiz4xy/pFaZAHNm', // plaintext wachtwoord = "test"
            created_at: new Date(),
        },
    });

    // Create multiple classes
    const class1 = await prisma.class.upsert({
        where: {id: 1},
        update: {},
        create: {
            name: 'Math 101',
        },
    });

    const class2 = await prisma.class.upsert({
        where: {id: 2},
        update: {},
        create: {
            name: 'Physics 101',
        },
    });

    const class3 = await prisma.class.upsert({
        where: {id: 3},
        update: {},
        create: {
            name: 'Chemistry 101',
        },
    });

    const class4 = await prisma.class.upsert({
        where: {id: 4},
        update: {},
        create: {
            name: 'Coding 101',
        },
    });

    // Assign multiple teachers to classes
    await prisma.classTeacher.createMany({
        data: [
            {
                classes_id: class1.id,
                teachers_id: teacher1.id,
            },
            {
                classes_id: class1.id,
                teachers_id: teacher2.id,
            },
            {
                classes_id: class2.id,
                teachers_id: teacher2.id,
            },
            {
                classes_id: class2.id,
                teachers_id: teacher3.id,
            },
            {
                classes_id: class3.id,
                teachers_id: teacher1.id,
            },
            {
                classes_id: class4.id,
                teachers_id: teacher1.id,
            },
        ],
        skipDuplicates: true,
    });


    // Assign students to classes
    await prisma.classStudent.createMany({
        data: [
            {
                classes_id: class1.id,
                students_id: student1.id,
            },
            {
                classes_id: class1.id,
                students_id: student2.id,
            },
            {
                classes_id: class2.id,
                students_id: student1.id,
            },
            {
                classes_id: class2.id,
                students_id: student2.id,
            },
            {
                classes_id: class3.id,
                students_id: student1.id,
            },
        ],
        skipDuplicates: true,
    });

    // Insert Learning Paths
    const learningPath1 = await prisma.learningPath.upsert({
        where: {uuid: mathPathUuid},
        update: {},
        create: {
            hruid: 'math-path',
            uuid: mathPathUuid,
            language: 'en',
            title: 'Mathematics Learning Path',
            description: 'Basic math concepts',
        },
    });


    const learningPath2 = await prisma.learningPath.upsert({
        where: {uuid: physicsPathUuid},
        update: {},
        create: {
            hruid: 'physics-path',
            uuid: physicsPathUuid,
            language: 'en',
            title: 'Physics Learning Path',
            description: 'Basic physics concepts',
        },
    });

    // Insert Assignments
    const assignment1 = await prisma.assignment.upsert({
        where: {id: 1},
        update: {},
        create: {
            name: 'Algebra Test',
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // One week from now
            created_at: new Date(),
            learning_path: learningPath1.uuid,
            class: class1.id,
        },
    });

    const assignment2 = await prisma.assignment.upsert({
        where: {id: 2},
        update: {},
        create: {
            name: 'Thermodynamics Test',
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // One week from now
            created_at: new Date(),
            learning_path: learningPath2.uuid,
            class: class2.id,
        },
    });

    const assignment3 = await prisma.assignment.upsert({
        where: {id: 3},
        update: {},
        create: {
            name: 'Math Test',
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // One week from now
            created_at: new Date(),
            learning_path: learningPath2.uuid,
            class: class1.id,
        },
    });

    // Insert Groups
    const group5 = await prisma.group.upsert({
        where: {id: 1},
        update: {},
        create: {
            name: 'Group Quintinus hoedius',
            class: class1.id,
            assignment: assignment1.id,
        },
    });

    const group1 = await prisma.group.upsert({
        where: {id: 1},
        update: {},
        create: {
            name: 'Group A',
            class: class1.id,
            assignment: assignment1.id,
        },
    });

    await prisma.studentGroup.upsert({
        where: {
            students_id_groups_id: {
                students_id: 1,
                groups_id: 1,
            }
        },
        update: {},
        create: {
            groups: {
                connect: {id: group5.id}
            },
            students: {
                connect: {id: student1.id}
            }
        },
    });

    const assignment4 = await prisma.assignment.upsert({
        where: {id: 4},
        update: {},
        create: {
            name: 'Coding Test',
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // One week from now
            created_at: new Date(),
            learning_path: learningPath2.uuid,
            class: class1.id,
        },
    });

    await prisma.assignment.upsert({
        where: {id: 5},
        update: {},
        create: {
            name: 'Quintinus hoedius test',
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // One week from now
            created_at: new Date(),
            learning_path: learningPath2.uuid,
            class: class1.id,
            groups: {
                connect: {id: group5.id} // Meerdere groups koppelen
            },
        },
    });


    const group2 = await prisma.group.upsert({
        where: {id: 2},
        update: {},
        create: {
            name: 'Group B',
            class: class2.id,
            assignment: assignment2.id,
        },
    });

    await prisma.group.upsert({
        where: {id: 3},
        update: {},
        create: {
            name: 'Group C',
            class: class1.id,
            assignment: assignment3.id,
        },
    });

    const group4 = await prisma.group.upsert({
        where: {id: 4},
        update: {},
        create: {
            name: 'Group D',
            class: class1.id,
            assignment: assignment4.id,
        },
    });

    // Insert Submissions
    await prisma.submission.create({
        data: {
            group: group1.id,
            assignment: assignment1.id,
            submission_type: 'multiplechoice',
            submission_content: {answer: '42'},
            graded_by: teacher1.id,
        },
    });

    await prisma.submission.create({
        data: {
            group: group2.id,
            assignment: assignment2.id,
            submission_type: 'multiplechoice',
            submission_content: {answer: '33'},
            graded_by: teacher3.id,
        },
    });


// Insert Learning Objects
    const learningObject1 = await prisma.learningObject.upsert({
        where: {uuid: '550e8400-e29b-41d4-a716-446655440002'},
        update: {},
        create: {
            id: '550e8400-e29b-41d4-a716-446655440002',
            uuid: '550e8400-e29b-41d4-a716-446655440002',
            hruid: 'Algebra Basics',
            language: 'en',
            version: '1.0',
            html_content: 'Introduction to Algebra',
        },
    });

    const learningObject2 = await prisma.learningObject.upsert({
        where: {uuid: '550e8400-e29b-41d4-a716-446655440003'},
        update: {},
        create: {
            id: '550e8400-e29b-41d4-a716-446655440003',
            uuid: '550e8400-e29b-41d4-a716-446655440003',
            hruid: 'Thermodynamics Basics',
            language: 'en',
            version: '1.0',
            html_content: 'Introduction to Thermodynamics',
        },
    });

// Insert conversations
    await prisma.conversation.createMany({
        data: [
            {
                title: 'Group 1 conversation',
                group: group1.id,
                assignment: assignment1.id,
                learning_object: learningObject1.uuid,
            },
            {
                title: 'Group 2 conversation',
                group: group1.id,
                assignment: assignment1.id,
                learning_object: learningObject1.uuid,
            },
            {
                title: 'Group 4 conversation',
                group: group4.id,
                assignment: assignment4.id,
                learning_object: learningObject1.uuid,
            },
        ],
        skipDuplicates: true,
    });


// Insert messages
    await prisma.message.createMany({
        data: [
            {
                content: "I don't understand this part of the assignment",
                date: new Date(Date.now()),
                student: student1.id,
                is_student: true,
                conversation: 1,
            },
        ]
    });

    await prisma.notification.createMany({
        data: [
            {
                type: 'QUESTION',
                read: false,
                student: student1.id,
            },
            {
                type: 'INVITE',
                read: false,
                student: student1.id,
            },
            {
                type: 'QUESTION',
                read: false,
                student: student2.id,
            },

            {
                type: 'QUESTION',
                read: false,
                teacher: teacher1.id,
            },
            {
                type: 'INVITE',
                read: false,
                teacher: teacher1.id,
            },
            {
                type: 'QUESTION',
                read: false,
                teacher: student2.id,
            },
        ]
    });

    console.log('✅ Seeding complete.');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });