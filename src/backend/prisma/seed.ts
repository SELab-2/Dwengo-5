import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

main().catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});

async function main() {
    console.log('🌱 Seeding database...');

    const {
        learningObject1,
        learningObject2,
        learningObject3,
        learningObject4,
        learningObject5
    } = await createLearningObjects();

    const {learningPath1, learningPath2} = await createLearningPaths();

    await fillLearningPaths(learningObject1, learningObject2, learningObject3, learningObject4, learningObject5, learningPath1);

    const {teacher1, teacher2, teacher3} = await createTeachers();

    const {student1, student2, student3} = await createStudents();

    const {class1, class2, class3, class4} = await createClasses();

    await assignUsersToClasses(class1, teacher1, teacher2, class2, teacher3, class3, class4, student1, student2);

    const {
        assignment1,
        assignment2,
        assignment3,
        assignment4,
        assignment5
    } = await createAssignments(learningPath1, class1, learningPath2, class2);

    const {
        group1,
        group2,
        group3,
        group4,
        group5,
        group6
    } = await createAndFillGroups(class1, assignment1, student1, class2, assignment2, assignment3, assignment4, assignment5);

    await putStudentsInGroups(group1, group5, group6, student1, class2);

    await createSubmissions(group1, assignment1, teacher1, group2, assignment2, teacher3);

    const {
        conversation1,
        conversation2,
        conversation3
    } = await createConversations(group1, assignment1, learningObject1, group4, assignment4, student1);

    await createMessages(student1, conversation1);

    await createNotifications(student1, student2, teacher1);

    console.log('✅ Seeding complete.');
}

async function createLearningObjects() {
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
            teacher_exclusive: true,
            difficulty: 18,
            estimated_time: 12,
            available: false,
            content_location: "op u mama haar harde schijf"
        }
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
            teacher_exclusive: false, difficulty: -1, estimated_time: 19, available: true, content_location: "nergens"
        }
    });

    const learningObject3 = await prisma.learningObject.upsert({
        where: {uuid: '550e8400-e29b-41d4-a716-446655440004'},
        update: {},
        create: {
            id: '550e8400-e29b-41d4-a716-446655440004',
            uuid: '550e8400-e29b-41d4-a716-446655440004',
            hruid: 'Algebra',
            language: 'en',
            version: '1.0',
            html_content: 'Chapter 1 Algebra',
            teacher_exclusive: false, difficulty: -1, estimated_time: 19, available: true, content_location: "nergens"
        }
    });


    const learningObject4 = await prisma.learningObject.upsert({
        where: {uuid: '550e8400-e29b-41d4-a716-446655440005'},
        update: {},
        create: {
            id: '550e8400-e29b-41d4-a716-446655440005',
            uuid: '550e8400-e29b-41d4-a716-446655440005',
            hruid: 'Algebra',
            language: 'en',
            version: '1.0',
            html_content: 'Chapter 5 to Algebra',
            teacher_exclusive: false, difficulty: -1, estimated_time: 19, available: true, content_location: "nergens"
        }
    });


    const learningObject5 = await prisma.learningObject.upsert({
        where: {uuid: '550e8400-e29b-41d4-a716-446655440006'},
        update: {},
        create: {
            id: '550e8400-e29b-41d4-a716-446655440006',
            uuid: '550e8400-e29b-41d4-a716-446655440006',
            hruid: 'Algebra',
            language: 'en',
            version: '1.0',
            html_content: 'Chapter 6 to Algebra',
            teacher_exclusive: false, difficulty: -1, estimated_time: 19, available: true, content_location: "nergens"
        }

    });


    const learningObject6 = await prisma.learningObject.upsert({
        where: {uuid: '550e8400-e29b-41d4-a716-446655440007'},
        update: {},
        create: {
            id: '550e8400-e29b-41d4-a716-446655440007',
            uuid: '550e8400-e29b-41d4-a716-446655440007',
            hruid: 'Algebra',
            language: 'en',
            version: '1.0',
            html_content: 'Chapter 1 Physics',
            teacher_exclusive: false, difficulty: -1, estimated_time: 19, available: true, content_location: "nergens"
        }
    });

    return {learningObject1, learningObject2, learningObject3, learningObject4, learningObject5, learningObject6};
}

async function createLearningPaths() {
    const learningPath1 = await prisma.learningPath.create({
        data: {
            id: 'math-path id',
            hruid: 'math-path',
            uuid: "550e8400-e29b-41d4-a716-446655440000",
            language: 'en',
            title: 'Mathematics Learning Path',
            description: 'Basic math concepts'
        }
    });


    const learningPath2 = await prisma.learningPath.create({
        data: {
            id: 'physics-path id',
            hruid: 'physics-path',
            uuid: "550e8400-e29b-41d4-a716-446655440001",
            language: 'en',
            title: 'Physics Learning Path',
            description: 'Basic physics concepts'
        }
    });
    return {learningPath1, learningPath2};
}

async function fillLearningPaths(learningObject1: any, learningObject2: any, learningObject3: any, learningObject4: any, learningObject5: any, learningPath1: any) {
    //de graaf is een huis
    /*
        /4----3
       / |    |
      0  |    |
       \ |    |
        \1----2
     */
    const learningPathNode0 = await prisma.learningPathNode.create({
        data: {
            learning_object_id: learningObject1.id,
            learning_path_id: learningPath1.id,
            start_node: true
        }
    });
    const learningPathNode1 = await prisma.learningPathNode.create({
        data: {
            learning_object_id: learningObject2.id,
            learning_path_id: learningPath1.id,
            start_node: false
        }
    });
    const learningPathNode2 = await prisma.learningPathNode.create({
        data: {
            learning_object_id: learningObject3.id,
            learning_path_id: learningPath1.id,
            start_node: false
        }
    });
    const learningPathNode3 = await prisma.learningPathNode.create({
        data: {
            learning_object_id: learningObject4.id,
            learning_path_id: learningPath1.id,
            start_node: false
        }
    });
    const learningPathNode4 = await prisma.learningPathNode.create({
        data: {
            learning_object_id: learningObject5.id,
            learning_path_id: learningPath1.id,
            start_node: false
        }
    });
    await prisma.transition.createMany({
        data: [
            {
                source_node_id: learningPathNode0.id,
                destination_node_id: learningPathNode1.id,
                condition_min: 0,
                condition_max: 12
            },
            {
                source_node_id: learningPathNode0.id,
                destination_node_id: learningPathNode4.id,
                condition_min: 12,
                condition_max: 20
            },
            {
                source_node_id: learningPathNode1.id,
                destination_node_id: learningPathNode2.id,
                condition_min: 0,
                condition_max: -1
            },
            {
                source_node_id: learningPathNode2.id,
                destination_node_id: learningPathNode3.id,
                condition_min: 0,
                condition_max: -1
            },
            {
                source_node_id: learningPathNode4.id,
                destination_node_id: learningPathNode3.id,
                condition_min: 0,
                condition_max: -1
            }
        ]
    })
}

async function putStudentsInGroups(group1: any, group5: any, group6: any, student1: any, class2: any) {
    await prisma.studentGroup.create({
        data: {
            group_id: group1.id,
            student_id: student1.id
        }
    });


    await prisma.studentGroup.create({
        data: {
            group_id: group5.id,
            student_id: student1.id
        }
    });


    await prisma.studentGroup.create({
        data: {
            group_id: group6.id,
            student_id: student1.id
        }
    });
}

async function createTeachers() {
    const teacher1 = await prisma.user.create({
        data: {
            username: 'teacher_one',
            email: 'teacher1@example.com',
            password: '$2a$10$Xj9pdYzG2HLQM8PIfEK6X.3aki1O12suDiPeCHIiz4xy/pFaZAHNm', // plaintext password = "test"

            created_at: new Date()
        }
    });
    await prisma.teacher.create({data: {id: teacher1.id}});

    const teacher2 = await prisma.user.create({
        data: {
            username: 'teacher_two',
            email: 'teacher2@example.com',
            password: '$2a$10$Xj9pdYzG2HLQM8PIfEK6X.3aki1O12suDiPeCHIiz4xy/pFaZAHNm', // plaintext password = "test"

            created_at: new Date()
        }
    });
    await prisma.teacher.create({data: {id: teacher2.id}});

    const teacher3 = await prisma.user.create({
        data: {
            username: 'teacher_three',
            email: 'teacher3@example.com',
            password: '$2a$10$Xj9pdYzG2HLQM8PIfEK6X.3aki1O12suDiPeCHIiz4xy/pFaZAHNm', // plaintext password = "test"
            created_at: new Date()
        }
    });
    await prisma.teacher.create({data: {id: teacher3.id}});

    return {teacher1, teacher2, teacher3};
}

async function createStudents() {
    const student1 = await prisma.user.create({
        data: {
            username: 'student_one',
            email: 'student1@example.com',
            password: '$2a$10$Xj9pdYzG2HLQM8PIfEK6X.3aki1O12suDiPeCHIiz4xy/pFaZAHNm', // plaintext password = "test"

            created_at: new Date()
        }
    });
    await prisma.student.create({data: {id: student1.id}});

    const student2 = await prisma.user.create({
        data: {
            username: 'student_two',
            email: 'student2@example.com',
            password: '$2a$10$Xj9pdYzG2HLQM8PIfEK6X.3aki1O12suDiPeCHIiz4xy/pFaZAHNm', // plaintext password = "test"

            created_at: new Date()
        }
    });
    await prisma.student.create({data: {id: student2.id}});

    const student3 = await prisma.user.create({
        data: {
            username: 'student_five',
            email: 'student5@example.com',
            password: '$2a$10$Xj9pdYzG2HLQM8PIfEK6X.3aki1O12suDiPeCHIiz4xy/pFaZAHNm', // plaintext password = "test"
            created_at: new Date()
        }
    });
    await prisma.student.create({data: {id: student3.id}});

    return {student1, student2, student3};
}

async function createClasses() {
    const class1 = await prisma.class.upsert({
        where: {id: 1},
        update: {},
        create: {
            name: 'Math 101'
        }
    });

    const class2 = await prisma.class.upsert({
        where: {id: 2},
        update: {},
        create: {
            name: 'Physics 101'
        }
    });

    const class3 = await prisma.class.upsert({
        where: {id: 3},
        update: {},
        create: {
            name: 'Chemistry 101'
        }
    });

    const class4 = await prisma.class.upsert({
        where: {id: 4},
        update: {},
        create: {
            name: 'Coding 101'
        }
    });
    return {class1, class2, class3, class4};
}

async function assignUsersToClasses(class1: any, teacher1: any, teacher2: any, class2: any, teacher3: any, class3: any, class4: any, student1: any, student2: any) {
    await prisma.classUser.createMany({
        data: [
            {class_id: class1.id, user_id: teacher1.id},
            {class_id: class1.id, user_id: teacher2.id},
            {class_id: class2.id, user_id: teacher2.id},
            {class_id: class2.id, user_id: teacher3.id},
            {class_id: class3.id, user_id: teacher1.id},
            {class_id: class4.id, user_id: teacher1.id},
            {class_id: class1.id, user_id: student1.id},
            {class_id: class1.id, user_id: student2.id},
            {class_id: class2.id, user_id: student1.id},
            {class_id: class2.id, user_id: student2.id},
            {class_id: class3.id, user_id: student1.id}
        ]
    });
}

async function createAssignments(learningPath1: any, class1: any, learningPath2: any, class2: any) {
    const assignment1 = await prisma.assignment.create({
        data: {

            name: 'Algebra Test',
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // one week from now
            created_at: new Date(),
            learning_path_id: learningPath1.id,
            class_id: class1.id
        }
    });

    const assignment2 = await prisma.assignment.create({
        data: {
            name: 'Thermodynamics Test',
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // one week from now
            created_at: new Date(),
            learning_path_id: learningPath2.id,
            class_id: class2.id
        }
    });

    const assignment3 = await prisma.assignment.create({
        data: {
            name: 'Math Test',
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // one week from now
            created_at: new Date(),
            learning_path_id: learningPath2.id,
            class_id: class1.id
        }
    });

    const assignment4 = await prisma.assignment.create({
        data: {
            name: 'Coding Test',
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // one week from now
            created_at: new Date(),
            learning_path_id: learningPath2.id,
            class_id: class1.id
        }
    });

    const assignment5 = await prisma.assignment.create({
        data: {
            name: 'Quintinus hoedius test',
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // one week from now
            created_at: new Date(),
            learning_path_id: learningPath2.id,
            class_id: class1.id
        }
    });

    await prisma.assignment.create({
        data: {
            name: 'Math Test',
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // One week from now
            created_at: new Date(),
            learning_path_id: learningPath2.id,
            class_id: class2.id
        }
    });

    return {assignment1, assignment2, assignment3, assignment4, assignment5};
}

async function createAndFillGroups(class1: any, assignment1: any, student1: any, class2: any, assignment2: any, assignment3: any, assignment4: any, assignment5: any) {
    const group1 = await prisma.group.create({
        data: {
            name: 'Group A',
            class_id: class1.id,
            assignment_id: assignment1.id
        }
    });

    const group2 = await prisma.group.create({
        data: {
            name: 'Group B',
            class_id: class2.id,
            assignment_id: assignment2.id
        }
    });

    const group3 = await prisma.group.create({
        data: {
            name: 'Group C',
            class_id: class1.id,
            assignment_id: assignment3.id
        }
    });

    const group4 = await prisma.group.create({
        data: {
            name: 'Group D',
            class_id: class1.id,
            assignment_id: assignment4.id
        }
    });

    const group5 = await prisma.group.create({
        data: {
            name: 'Group Quintinus hoedius',
            class_id: class1.id,
            assignment_id: assignment5.id
        }
    });

    const group6 = await prisma.group.create({
        data: {
            name: 'Group B',
            class_id: class2.id,
            assignment_id: 5
        }
    });

    return {group1, group2, group3, group4, group5, group6};
}

async function createSubmissions(group1: any, assignment1: any, teacher1: any, group2: any, assignment2: any, learninpathnode1: any) {
    await prisma.submission.create({
        data: {
            group_id: group1.id,
            assignment_id: assignment1.id,
            submission_type: 'multiplechoice',
            submission_content: {answer: '42'},
            graded_by: teacher1.id,
            grade: 12,
            learning_path_node_id: learninpathnode1.id
        }
    });

    await prisma.submission.create({
        data: {
            group_id: group2.id,
            assignment_id: assignment2.id,
            submission_type: 'multiplechoice',
            submission_content: {answer: '33'},
            grade: -1,
            learning_path_node_id: learninpathnode1.id
        }
    });
}

async function createConversations(group1: any, assignment1: any, learningObject1: any, group4: any, assignment4: any, student1: any) {
    const conversation1 = await prisma.conversation.create({
        data:
            {
                title: 'Group 1 conversation',
                student_id: student1.id,
                group_id: group1.id,
                assignment_id: assignment1.id,
                learning_object_id: learningObject1.uuid
            }
    })
    const conversation2 = await prisma.conversation.create({
        data:
            {
                title: 'Group 2 conversation',
                student_id: student1.id,
                group_id: group1.id,
                assignment_id: assignment1.id,
                learning_object_id: learningObject1.uuid
            }
    });
    const conversation3 = await prisma.conversation.create({
        data:
            {
                title: 'Group 4 conversation',
                student_id: student1.id,
                group_id: group4.id,
                assignment_id: assignment4.id,
                learning_object_id: learningObject1.uuid
            }
    });
    return {conversation1, conversation2, conversation3}
}

async function createMessages(student1: any, conversation1: any) {
    await prisma.message.createMany({
        data: [
            {
                content: "I don't understand this part of the assignment",
                date: new Date(),
                user_id: student1.id,
                conversation_id: conversation1.id
            }
        ]
    });
}

async function createNotifications(student1: any, student2: any, teacher1: any) {
    await prisma.notification.createMany({
        data: [
            {
                type: 'QUESTION',
                read: false,
                user_id: student1.id
            },
            {
                type: 'INVITE',
                read: false,
                user_id: student1.id
            },
            {
                type: 'QUESTION',
                read: false,
                user_id: student2.id
            },

            {
                type: 'QUESTION',
                read: false,
                user_id: teacher1.id
            },
            {
                type: 'INVITE',
                read: false,
                user_id: teacher1.id
            },
            {
                type: 'QUESTION',
                read: false,
                user_id: student2.id
            }
        ]
    });
}