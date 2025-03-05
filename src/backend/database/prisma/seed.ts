import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const teacher1 = await prisma.teacher.upsert({
    where: { email: 'teacher1@example.com' },
    update: {},
    create: {
      username: 'teacher_one',
      email: 'teacher1@example.com',
      password: '$2a$10$Xj9pdYzG2HLQM8PIfEK6X.3aki1O12suDiPeCHIiz4xy/pFaZAHNm', // plaintext wachtwoord = "test"
      active_language: 'en',
      created_at: new Date(),
    },
  });

  const teacher2 = await prisma.teacher.upsert({
    where: { email: 'teacher2@example.com' },
    update: {},
    create: {
      username: 'teacher_two',
      email: 'teacher2@example.com',
      password: '$2a$10$Xj9pdYzG2HLQM8PIfEK6X.3aki1O12suDiPeCHIiz4xy/pFaZAHNm', // plaintext wachtwoord = "test"
      active_language: 'en',
      created_at: new Date(),
    },
  });

  const teacher3 = await prisma.teacher.upsert({
    where: { email: 'teacher3@example.com' },
    update: {},
    create: {
      username: 'teacher_three',
      email: 'teacher3@example.com',
      password: '$2a$10$Xj9pdYzG2HLQM8PIfEK6X.3aki1O12suDiPeCHIiz4xy/pFaZAHNm', // plaintext wachtwoord = "test"
      active_language: 'en',
      created_at: new Date(),
    },
  });

  // Create multiple students
  const student1 = await prisma.student.upsert({
    where: { email: 'student1@example.com' },
    update: {},
    create: {
      username: 'student_one',
      email: 'student1@example.com',
      password: '$2a$10$Xj9pdYzG2HLQM8PIfEK6X.3aki1O12suDiPeCHIiz4xy/pFaZAHNm', // plaintext wachtwoord = "test"
      active_language: 'en',
      created_at: new Date(),
    },
  });

  const student2 = await prisma.student.upsert({
    where: { email: 'student2@example.com' },
    update: {},
    create: {
      username: 'student_two',
      email: 'student2@example.com',
      password: '$2a$10$Xj9pdYzG2HLQM8PIfEK6X.3aki1O12suDiPeCHIiz4xy/pFaZAHNm', // plaintext wachtwoord = "test"
      active_language: 'en',
      created_at: new Date(),
    },
  });

  // Create multiple classes
  const class1 = await prisma.class.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Math 101',
    },
  });

  const class2 = await prisma.class.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Physics 101',
    },
  });

  const class3 = await prisma.class.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'Chemistry 101',
    },
  });

  // Assign multiple teachers to classes
  await prisma.classTeacher.createMany({
    data: [
      {
        class_id: class1.id,
        teacher_id: teacher1.id,
      },
      {
        class_id: class1.id,
        teacher_id: teacher2.id,
      },
      {
        class_id: class2.id,
        teacher_id: teacher2.id,
      },
      {
        class_id: class2.id,
        teacher_id: teacher3.id,
      },
      {
        class_id: class3.id,
        teacher_id: teacher1.id,
      },
    ],
  });

  // Assign students to classes
  await prisma.classStudent.createMany({
    data: [
      {
        class_id: class1.id,
        student_id: student1.id,
      },
      {
        class_id: class1.id,
        student_id: student2.id,
      },
      {
        class_id: class2.id,
        student_id: student1.id,
      },
      {
        class_id: class2.id,
        student_id: student2.id,
      },
      {
        class_id: class3.id,
        student_id: student1.id,
      },
    ],
  });

  // Insert Learning Paths
  const learningPath1 = await prisma.learningPath.upsert({
    where: { uuid: '550e8400-e29b-41d4-a716-446655440000' },
    update: {},
    create: {
      hruid: 'math-path',
      uuid: '550e8400-e29b-41d4-a716-446655440000',
      language: 'en',
      title: 'Mathematics Learning Path',
      description: 'Basic math concepts',
    },
  });

  const learningPath2 = await prisma.learningPath.upsert({
    where: { uuid: '550e8400-e29b-41d4-a716-446655440001' },
    update: {},
    create: {
      hruid: 'physics-path',
      uuid: '550e8400-e29b-41d4-a716-446655440001',
      language: 'en',
      title: 'Physics Learning Path',
      description: 'Basic physics concepts',
    },
  });

  // Insert Assignments
  const assignment1 = await prisma.assignment.upsert({
    where: { id: 1 },
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
    where: { id: 2 },
    update: {},
    create: {
      name: 'Thermodynamics Test',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // One week from now
      created_at: new Date(),
      learning_path: learningPath2.uuid,
      class: class2.id,
    },
  });

  // Insert Groups
  const group1 = await prisma.group.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Group A',
      class: class1.id,
      assignment: assignment1.id,
    },
  });

  const group2 = await prisma.group.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Group B',
      class: class2.id,
      assignment: assignment2.id,
    },
  });

  // Insert Submissions
  await prisma.submission.create({
    data: {
      group: group1.id,
      assignment: assignment1.id,
      submission_type: 'multiplechoice',
      submission_content: { answer: '42' },
      graded_by: teacher1.id,
    },
  });

  await prisma.submission.create({
    data: {
      group: group2.id,
      assignment: assignment2.id,
      submission_type: 'multiplechoice',
      submission_content: { answer: '33' },
      graded_by: teacher3.id,
    },
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
