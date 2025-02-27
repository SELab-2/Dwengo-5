import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // const newTeacher = await prisma.teachers.create({
    //     data: {
    //         username: 'Alice',
    //         password: 'test',
    //         email: 'test@mail.com',
    //         active_language: 'en',
    //         created_at: new Date(),
    //     }
    // });
    //
    // // Query all users
    // const teachers = await prisma.teachers.findMany();
    // console.log('All teachers:', teachers);
}

main()
    .catch((e) => {
        console.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
