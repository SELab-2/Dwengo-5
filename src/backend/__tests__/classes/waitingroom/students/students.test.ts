import request from "supertest";
import {beforeAll, afterAll,describe, expect, it, vi} from "vitest";
import index, {prisma} from "../../../../index.ts";

vi.mock("../prismaClient", () => ({
    classStudent: {
        findMany: vi.fn(),
    },
}));


let authToken: string;
let waitingRoomLength: number;
let studentLength: number;
const classId = 1;

beforeAll(async () => {
    // Perform login as teacher1
    const loginPayload = {
        email: "teacher1@example.com",
        password: "test",
    };

    const res = await request(index).post("/authentication/login?usertype=teacher").send(loginPayload);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");

    authToken = res.body.token;
});


describe("WaitingroomStudent initial state", () => {
  beforeAll(async () => {
    await prisma.$executeRaw`BEGIN`;
  });

  afterAll(async () => {
    await prisma.$executeRaw`ROLLBACK`;
  });
    it('initial state', async () => {
        const getWaiting = await request(index)
            .get(`/classes/${classId}/waitingroom/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(getWaiting.status).toBe(200);
        expect(getWaiting.body).toHaveProperty('students');

        const getStudents = await request(index)
            .get(`/classes/${classId}/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(getStudents.status).toBe(200);
        expect(getStudents.body).toHaveProperty('students');


        waitingRoomLength = getWaiting.body.students.length;
        studentLength = getStudents.body.students.length;
    });
});

describe("WaitingroomStudent post->patch lifecycle", () => {
  beforeAll(async () => {
    await prisma.$executeRaw`BEGIN`;
  });

  afterAll(async () => {
    await prisma.$executeRaw`ROLLBACK`;
  });
    it ('get all waitingroomStudents', async () => {
        const res = await request(index)
            .get(`/classes/${classId}/waitingroom/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('students');
        expect(res.body.students).toHaveLength(waitingRoomLength);
    });

    it ('get all students', async () => {
       const res = await request(index)
              .get(`/classes/${classId}/students`)
              .set("Authorization", `Bearer ${authToken.trim()}`);
       expect(res.status).toBe(200);
       expect(res.body).toHaveProperty('students');
       expect(res.body.students).toHaveLength(studentLength);
    });

    it ("post waitingroomStudent", async () => {
        const post = await request(index)
            .post(`/classes/${classId}/waitingroom/students`)
            .send({student: "/students/3"})
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(post.status).toBe(200);
    });

    it ("get all waitingroomStudents", async () => {
        const res = await request(index)
            .get(`/classes/${classId}/waitingroom/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('students');
        expect(res.body.students).toHaveLength(waitingRoomLength + 1);
    });
    it ('get all students', async () => {
        const res = await request(index)
            .get(`/classes/${classId}/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('students');
        expect(res.body.students).toHaveLength(studentLength);
    });


    it ('patch waitingroomStudent', async () => {
        const del = await request(index)
            .patch(`/classes/${classId}/waitingroom/students/3`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(del.status).toBe(200);
    });

    it ('check all waitingroomStudents', async () => {
        const get = await request(index)
            .get(`/classes/${classId}/waitingroom/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(get.status).toBe(200);
        expect(get.body).toHaveProperty('students');
        expect(get.body.students).toHaveLength(waitingRoomLength);
    });
    it ('check all students', async () => {
        const get = await request(index)
            .get(`/classes/${classId}/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(get.status).toBe(200);
        expect(get.body).toHaveProperty('students');
        expect(get.body.students).toHaveLength(studentLength + 1);
    });

    it ("delete student", async () => {
        const del = await request(index)
            .delete(`/classes/${classId}/students/3`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(del.status).toBe(200);
    });

    it ('check all waitingroomStudents', async () => {
        const get = await request(index)
            .get(`/classes/${classId}/waitingroom/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(get.status).toBe(200);
        expect(get.body).toHaveProperty('students');
        expect(get.body.students).toHaveLength(waitingRoomLength);
    });
    it ('check all students', async () => {
        const get = await request(index)
            .get(`/classes/${classId}/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(get.status).toBe(200);
        expect(get.body).toHaveProperty('students');
        expect(get.body.students).toHaveLength(studentLength);
    });
});

describe("WaitingroomStudent post->delete lifecycle", () => {
  beforeAll(async () => {
    await prisma.$executeRaw`BEGIN`;
  });

  afterAll(async () => {
    await prisma.$executeRaw`ROLLBACK`;
  });
    it ('get all waitingroomStudents', async () => {
        const res = await request(index)
            .get(`/classes/${classId}/waitingroom/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('students');
        expect(res.body.students).toHaveLength(waitingRoomLength);
    });

    it ('get all students', async () => {
        const res = await request(index)
            .get(`/classes/${classId}/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('students');
        expect(res.body.students).toHaveLength(studentLength);
    });

    it ("post waitingroomStudent", async () => {
        const post = await request(index)
            .post(`/classes/${classId}/waitingroom/students`)
            .send({student: "/students/3"})
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(post.status).toBe(200);
    });

    it ("get all waitingroomStudents", async () => {
        const res = await request(index)
            .get(`/classes/${classId}/waitingroom/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('students');
        expect(res.body.students).toHaveLength(waitingRoomLength + 1);
    });
    it ('get all students', async () => {
        const res = await request(index)
            .get(`/classes/${classId}/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('students');
        expect(res.body.students).toHaveLength(studentLength);
    });


    it ('delete waitingroomStudent', async () => {
        const del = await request(index)
            .delete(`/classes/${classId}/waitingroom/students/3`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(del.status).toBe(200);
    });

    it ('check all waitingroomStudents', async () => {
        const get = await request(index)
            .get(`/classes/${classId}/waitingroom/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(get.status).toBe(200);
        expect(get.body).toHaveProperty('students');
        expect(get.body.students).toHaveLength(waitingRoomLength);
    });
    it ('check all students', async () => {
        const get = await request(index)
            .get(`/classes/${classId}/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(get.status).toBe(200);
        expect(get.body).toHaveProperty('students');
        expect(get.body.students).toHaveLength(studentLength);
    });
});

describe("WaitingroomStudent get edgecases", () => {
  beforeAll(async () => {
    await prisma.$executeRaw`BEGIN`;
  });

  afterAll(async () => {
    await prisma.$executeRaw`ROLLBACK`;
  });
    it("invalid classId", async () => {
        const res = await request(index)
            .get(`/classes/invalid/waitingroom/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
    })

    it("no auth", async () => {
        const res = await request(index)
            .get(`/classes/${classId}/students`);

        expect(res.status).toBe(401);
    })
});

describe("WaitingroomStudent post edgecases", () => {
  beforeAll(async () => {
    await prisma.$executeRaw`BEGIN`;
  });

  afterAll(async () => {
    await prisma.$executeRaw`ROLLBACK`;
  });
    it("invalid classId", async () => {
        const res = await request(index)
            .post(`/classes/invalid/waitingroom/students`)
            .send({student: "/students/3"})
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
    })

    it ("invalid student", async () => {
        const res = await request(index)
            .post(`/classes/${classId}/waitingroom/students`)
            .send({student: "/students/invalid"})
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
    });

    it("no auth", async () => {
        const res = await request(index)
            .post(`/classes/${classId}/waitingroom/students`)
            .send({student: "/students/3"});

        expect(res.status).toBe(401);
    })
});

describe("WaitingroomStudent patch edgecases", () => {
  beforeAll(async () => {
    await prisma.$executeRaw`BEGIN`;
  });

  afterAll(async () => {
    await prisma.$executeRaw`ROLLBACK`;
  });
    it("invalid classId", async () => {
        const res = await request(index)
            .patch(`/classes/invalid/waitingroom/students/3`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
    })

    it("invalid studentId", async () => {
        const res = await request(index)
            .patch(`/classes/${classId}/waitingroom/students/invalid`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
    })

    it("no auth", async () => {
        const res = await request(index)
            .patch(`/classes/${classId}/waitingroom/students/3`);

        expect(res.status).toBe(401);
    })
})

describe("WaitingroomStudent delete edgecases", () => {
  beforeAll(async () => {
    await prisma.$executeRaw`BEGIN`;
  });

  afterAll(async () => {
    await prisma.$executeRaw`ROLLBACK`;
  });
    it("invalid classId", async () => {
        const res = await request(index)
            .delete(`/classes/invalid/waitingroom/students/3`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
    })

    it("invalid studentId", async () => {
        const res = await request(index)
            .delete(`/classes/${classId}/waitingroom/students/invalid`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
    })

    it("no auth", async () => {
        const res = await request(index)
            .delete(`/classes/${classId}/waitingroom/students/3`);

        expect(res.status).toBe(401);
    })
});
