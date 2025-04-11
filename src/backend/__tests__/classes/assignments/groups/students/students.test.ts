import request from "supertest";
import {beforeAll, afterAll,describe, expect, it, vi} from "vitest";
import index, {prisma} from '../../../../../index.ts';
import {splitId} from "../../../../../help/links.ts";

let authToken: string;
let wrongAuthToken: string;

const classId: number = 1;
const assignmentId: number = 1;
const groupId: number = 1;
const invalidId = "INVALID_ID";
const randomId = 696969;
const existingStudentButNotInGroup = 3;
let groupsLength: number;
let studentId: number;

beforeAll(async () => {
    // Perform login as teacher1
    const loginPayload = {
        email: "teacher1@example.com",
        password: "test",
    };

    const wrongLoginPayload = {
        email: "teacher3@example.com",
        password: "test",
    };

    const res = await request(index).post("/authentication/login?usertype=teacher").send(loginPayload);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");

    authToken = res.body.token;

    const res2 = await request(index).post("/authentication/login?usertype=teacher").send(wrongLoginPayload);

    expect(res2.status).toBe(200);
    expect(res2.body).toHaveProperty("token");

    wrongAuthToken = res2.body.token;
});

describe('GroupStudents initial state', () => {
  beforeAll(async () => {
    await prisma.$executeRaw`BEGIN`;
  });

  afterAll(async () => {
    await prisma.$executeRaw`ROLLBACK`;
  });
    it('init state', async () => {
        const get = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(get.status).toBe(200);
        expect(get.body).toHaveProperty('students');
        groupsLength = get.body.students.length;
    });
});

describe('GroupStudents lifecycle', () => {
  beforeAll(async () => {
    await prisma.$executeRaw`BEGIN`;
  });

  afterAll(async () => {
    await prisma.$executeRaw`ROLLBACK`;
  });
    it ('get all GroupStudents', async () => {
        const getAll = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(getAll.status).toBe(200);
        expect(getAll.body).toHaveProperty('students');
        expect(getAll.body.students.length).toBe(groupsLength);
    });

    it ('create GroupStudent', async () => {
        const body = {
            student: `/students/2`
        };
        const post = await request(index)
            .post(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`)
            .send(body);

        expect(post.status).toBe(200);
        expect(post.body).toHaveProperty('groupStudent');

        studentId = splitId(post.body.groupStudent);
    });

    it ('get all GroupStudents', async () => {
        const getAll = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(getAll.status).toBe(200);
        expect(getAll.body).toHaveProperty('students');
        expect(getAll.body.students.length).toBe(groupsLength + 1);
    });

    it ('delete GroupStudent', async () => {
        const deleteGroupStudent = await request(index)
            .delete(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/students/${studentId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(deleteGroupStudent.status).toBe(200);
    });

    it ('check all GroupStudents', async () => {
        const getAll = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(getAll.status).toBe(200);
        expect(getAll.body).toHaveProperty('students');
        expect(getAll.body.students.length).toBe(groupsLength);
    });
});


describe('GET all GroupStudents edgecases', () => {
  beforeAll(async () => {
    await prisma.$executeRaw`BEGIN`;
  });

  afterAll(async () => {
    await prisma.$executeRaw`ROLLBACK`;
  });
    it ('invalid classId', async () => {
        const get = await request(index)
            .get(`/classes/${invalidId}/assignments/${assignmentId}/groups/${groupId}/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(get.status).toBe(400);
        expect(get.body).toEqual({"error": "invalid classId"});
    });

    it ('invalid assignmentId', async () => {
        const get = await request(index)
            .get(`/classes/${classId}/assignments/${invalidId}/groups/${groupId}/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(get.status).toBe(400);
        expect(get.body).toEqual({"error": "invalid assignmentId"});
    });

    it ('invalid groupId', async () => {
        const get = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/groups/${invalidId}/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(get.status).toBe(400);
        expect(get.body).toEqual({"error": "invalid groupId"});
    });

    it ('no auth', async () => {
        const get = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/students`);

        expect(get.status).toBe(401);
    })

    it ('wrong auth', async () => {
       const get = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/students`)
            .set("Authorization", `Bearer ${wrongAuthToken.trim()}`);

        expect(get.status).toBe(403);
    });
});

describe('POST GroupStudents edgecases', () => {
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
            .post(`/classes/${invalidId}/assignments/${assignmentId}/groups/${groupId}/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`)
            .send(body);

        expect(post.status).toBe(400);
        expect(post.body).toEqual({"error": "invalid classId"});
    })

    it ('invalid assignmentId', async () => {
        const body = {
            student: `/students/${studentId}`
        };

        const post = await request(index)
            .post(`/classes/${classId}/assignments/${invalidId}/groups/${groupId}/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`)
            .send(body);

        expect(post.status).toBe(400);
        expect(post.body).toEqual({"error": "invalid assignmentId"});
    });

    it ('invalid groupId', async () => {
        const body = {
            student: `/students/${studentId}`
        };

        const post = await request(index)
            .post(`/classes/${classId}/assignments/${assignmentId}/groups/${invalidId}/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`)
            .send(body);

        expect(post.status).toBe(400);
        expect(post.body).toEqual({"error": "invalid groupId"});
    });

    it ('invalid studentLink', async () => {
        const body = {
            student: invalidId
        };

        const post = await request(index)
            .post(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`)
            .send(body);

        expect(post.status).toBe(400);
        expect(post.body).toEqual({"error": "invalid studentLink"});
    });

    it ('assignment not found', async () => {
        const body = {
            student: `/students/${studentId}`
        };

        const post = await request(index)
            .post(`/classes/${classId}/assignments/${randomId}/groups/${groupId}/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`)
            .send(body);

        expect(post.status).toBe(404);
        expect(post.body).toEqual({"error": "assignment not found"});
    })

    it ('group not found', async () => {
        const body = {
            student: `/students/${studentId}`
        };

        const post = await request(index)
            .post(`/classes/${classId}/assignments/${assignmentId}/groups/${randomId}/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`)
            .send(body);

        expect(post.status).toBe(404);
        expect(post.body).toEqual({"error": "group not found"});
    });

    it ('no auth', async () => {
        const body = {
            student: `/students/${studentId}`
        };

        const post = await request(index)
            .post(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/students`)
            .send(body);

        expect(post.status).toBe(401);
    });

    it ('wrong auth', async () => {
        const body = {
            student: `/students/${studentId}`
        };

        const post = await request(index)
            .post(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/students`)
            .set("Authorization", `Bearer ${wrongAuthToken.trim()}`)
            .send(body);

        expect(post.status).toBe(403);
    });
});


describe('DELETE GroupStudents edgecases', () => {
  beforeAll(async () => {
    await prisma.$executeRaw`BEGIN`;
  });

  afterAll(async () => {
    await prisma.$executeRaw`ROLLBACK`;
  });
    it ('invalid classId', async () => {
        const deleteGroupStudent = await request(index)
            .delete(`/classes/${invalidId}/assignments/${assignmentId}/groups/${groupId}/students/${studentId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(deleteGroupStudent.status).toBe(400);
        expect(deleteGroupStudent.body).toEqual({"error": "invalid classId"});
    });

    it ('invalid assignmentId', async () => {
        const deleteGroupStudent = await request(index)
            .delete(`/classes/${classId}/assignments/${invalidId}/groups/${groupId}/students/${studentId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(deleteGroupStudent.status).toBe(400);
        expect(deleteGroupStudent.body).toEqual({"error": "invalid assignmentId"});
    });

    it ('invalid groupId', async () => {
        const deleteGroupStudent = await request(index)
            .delete(`/classes/${classId}/assignments/${assignmentId}/groups/${invalidId}/students/${studentId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(deleteGroupStudent.status).toBe(400);
        expect(deleteGroupStudent.body).toEqual({"error": "invalid groupId"});
    });

    it ('invalid studentId', async () => {
        const deleteGroupStudent = await request(index)
            .delete(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/students/${invalidId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(deleteGroupStudent.status).toBe(400);
        expect(deleteGroupStudent.body).toEqual({"error": "invalid studentId"});
    });

    it ('assignment not found', async () => {
        const deleteGroupStudent = await request(index)
            .delete(`/classes/${classId}/assignments/${randomId}/groups/${groupId}/students/${studentId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(deleteGroupStudent.status).toBe(404);
        expect(deleteGroupStudent.body).toEqual({"error": "assignment not found"});
    })

    it ('no auth', async () => {
        const deleteGroupStudent = await request(index)
            .delete(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/students/${studentId}`);
        expect(deleteGroupStudent.status).toBe(401);
    })

    it ('wrong auth', async () => {
        const deleteGroupStudent = await request(index)
            .delete(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/students/${studentId}`)
            .set("Authorization", `Bearer ${wrongAuthToken.trim()}`);
        expect(deleteGroupStudent.status).toBe(403);
    });
})
