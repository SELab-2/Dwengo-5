import request from "supertest";
import {beforeAll, afterAll,describe, expect, it, vi} from "vitest";
import index, {prisma} from '../../../../index.ts';
import {s} from "vitest/dist/chunks/reporters.QZ837uWx";

let authToken: string;
let assignmentStudentLength: number;
const classId = 1;
const assignmentId = 1;
const studentId = 2;
const invalidId = 'INVALID_ID';

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


describe('AssignmentStudent initial state', () => {
  beforeAll(async () => {
    await prisma.$executeRaw`BEGIN`;
  });

  afterAll(async () => {
    await prisma.$executeRaw`ROLLBACK`;
  });
    it ('init state', async () => {
        const get = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(get.status).toBe(200);
        expect(get.body).toHaveProperty('students');
        assignmentStudentLength = get.body.students.length;

    });
});

describe("AssignmentStudent lifecycle", () => {
  beforeAll(async () => {
    await prisma.$executeRaw`BEGIN`;
  });

  afterAll(async () => {
    await prisma.$executeRaw`ROLLBACK`;
  });
    it ('get all AssignmentStudents', async () => {
        const getAll = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(getAll.status).toBe(200);
        expect(getAll.body).toHaveProperty('students');
        expect(getAll.body.students).toHaveLength(assignmentStudentLength);
    });

    it ('create AssignmentStudent', async () => {
        const body = {
            student: `/students/${studentId}`
        };

        const post = await request(index)
            .post(`/classes/${classId}/assignments/${assignmentId}/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`)
            .send(body);

        expect(post.status).toBe(200);
    });

    it ('get all AssignmentStudents', async () => {
        const getAll = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(getAll.status).toBe(200);
        expect(getAll.body).toHaveProperty('students');
        expect(getAll.body.students).toHaveLength(assignmentStudentLength + 1);
    })

    it ('delete AssignmentStudent', async () => {
        const del = await request(index)
            .delete(`/classes/${classId}/assignments/${assignmentId}/students/${studentId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(del.status).toBe(200);
    });

    it ('check all AssignmentStudents', async () => {
        const getAll = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(getAll.status).toBe(200);
        expect(getAll.body).toHaveProperty('students');
        expect(getAll.body.students).toHaveLength(assignmentStudentLength);
    });
});

describe('GET all AssignmentStudents edgecases', () => {
  beforeAll(async () => {
    await prisma.$executeRaw`BEGIN`;
  });

  afterAll(async () => {
    await prisma.$executeRaw`ROLLBACK`;
  });
    it('invalid classId', async () => {
        const get = await request(index)
            .get(`/classes/${invalidId}/assignments/${assignmentId}/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(get.status).toBe(400);
    });

    it('invalid assignmentId', async () => {
        const get = await request(index)
            .get(`/classes/${classId}/assignments/${invalidId}/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(get.status).toBe(400);
    });

    it('no auth', async () => {
        const get = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/students`);

        expect(get.status).toBe(401);
    });
});

describe('POST AssignmentStudents edgecases', () => {
  beforeAll(async () => {
    await prisma.$executeRaw`BEGIN`;
  });

  afterAll(async () => {
    await prisma.$executeRaw`ROLLBACK`;
  });
    it ('invalid classId', async () => {
        const body = {
            student: `/students/${studentId}`
        };

        const post = await request(index)
            .post(`/classes/${invalidId}/assignments/${assignmentId}/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`)
            .send(body);

        expect(post.status).toBe(400);
    });

    it ('invalid assignmentId', async () => {
        const body = {
            student: `/students/${studentId}`
        };

        const post = await request(index)
            .post(`/classes/${classId}/assignments/${invalidId}/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`)
            .send(body);

        expect(post.status).toBe(400);
    });

    it ('invalid studentLink', async () => {
        const body = {
            student: invalidId
        };

        const post = await request(index)
            .post(`/classes/${classId}/assignments/${assignmentId}/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`)
            .send(body);

        expect(post.status).toBe(400);
    });

    it ('no auth', async () => {
        const body = {
            student: `/students/${studentId}`
        };

        const post = await request(index)
            .post(`/classes/${classId}/assignments/${assignmentId}/students`)
            .send(body);

        expect(post.status).toBe(401);
    });
});

describe('DELETE AssignmentStudents edgecases', () => {
  beforeAll(async () => {
    await prisma.$executeRaw`BEGIN`;
  });

  afterAll(async () => {
    await prisma.$executeRaw`ROLLBACK`;
  });
    it ('invalid classId', async () => {
        const del = await request(index)
            .delete(`/classes/${invalidId}/assignments/${assignmentId}/students/${studentId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(del.status).toBe(400);
    });
    it ('invalid assignmentId', async () => {
        const del = await request(index)
            .delete(`/classes/${classId}/assignments/${invalidId}/students/${studentId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(del.status).toBe(400);
    });
    it ('invalid studentId', async () => {
        const del = await request(index)
            .delete(`/classes/${classId}/assignments/${assignmentId}/students/${invalidId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(del.status).toBe(400);
    })
});