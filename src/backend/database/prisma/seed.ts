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

  const class1 = await prisma.class.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Math 101',
    },
  });

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

  const group1 = await prisma.group.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Group A',
      class: class1.id,
      assignment: assignment1.id,
    },
  });

  await prisma.submission.create({
    data: {
      group: group1.id,
      assignment: assignment1.id,
      submission_type: 'multiplechoice',
      submission_content: { answer: '42' },
      graded_by: teacher1.id,
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
