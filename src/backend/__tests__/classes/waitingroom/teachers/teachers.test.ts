import request from "supertest";
import {beforeAll, describe, expect, it, vi} from "vitest";
import index from "../../../../index.ts";

vi.mock("../prismaClient", () => ({
    classteacher: {
        findMany: vi.fn()
    }
}));


let authToken: string;
let waitingRoomLength: number;
let teacherLength: number;
const classId = 1;

beforeAll(async () => {
    // Perform login as teacher1
    const loginPayload = {
        email: "teacher1@example.com",
        password: "test"
    };

    const res = await request(index).post("/authentication/login?usertype=teacher").send(loginPayload);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");

    authToken = res.body.token;
});


describe.skip("Waitingroomteacher initial state", () => {
    it('initial state', async () => {
        const getWaiting = await request(index)
            .get(`/classes/${classId}/waitingroom/teachers`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(getWaiting.status).toBe(200);
        expect(getWaiting.body).toHaveProperty('teachers');

        const getteachers = await request(index)
            .get(`/classes/${classId}/teachers`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(getteachers.status).toBe(200);
        expect(getteachers.body).toHaveProperty('teachers');


        waitingRoomLength = getWaiting.body.teachers.length;
        teacherLength = getteachers.body.teachers.length;
    });
});

describe.skip("Waitingroomteacher post->patch lifecycle", () => {
    it ('get all waitingroomteachers', async () => {
        const res = await request(index)
            .get(`/classes/${classId}/waitingroom/teachers`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('teachers');
        expect(res.body.teachers).toHaveLength(waitingRoomLength);
    });

    it ('get all teachers', async () => {
        const res = await request(index)
            .get(`/classes/${classId}/teachers`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('teachers');
        expect(res.body.teachers).toHaveLength(teacherLength);
    });

    it ("post waitingroomteacher", async () => {
        const post = await request(index)
            .post(`/classes/${classId}/waitingroom/teachers`)
            .send({teacher: "/teachers/3"})
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(post.status).toBe(200);
    });

    it ("get all waitingroomteachers", async () => {
        const res = await request(index)
            .get(`/classes/${classId}/waitingroom/teachers`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('teachers');
        expect(res.body.teachers).toHaveLength(waitingRoomLength + 1);
    });
    it ('get all teachers', async () => {
        const res = await request(index)
            .get(`/classes/${classId}/teachers`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('teachers');
        expect(res.body.teachers).toHaveLength(teacherLength);
    });


    it ('patch waitingroomteacher', async () => {
        const del = await request(index)
            .patch(`/classes/${classId}/waitingroom/teachers/3`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(del.status).toBe(200);
    });

    it ('check all waitingroomteachers', async () => {
        const get = await request(index)
            .get(`/classes/${classId}/waitingroom/teachers`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(get.status).toBe(200);
        expect(get.body).toHaveProperty('teachers');
        expect(get.body.teachers).toHaveLength(waitingRoomLength);
    });
    it ('check all teachers', async () => {
        const get = await request(index)
            .get(`/classes/${classId}/teachers`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(get.status).toBe(200);
        expect(get.body).toHaveProperty('teachers');
        expect(get.body.teachers).toHaveLength(teacherLength + 1);
    });

    it ("delete teacher", async () => {
        const del = await request(index)
            .delete(`/classes/${classId}/teachers/3`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(del.status).toBe(200);
    });

    it ('check all waitingroomteachers', async () => {
        const get = await request(index)
            .get(`/classes/${classId}/waitingroom/teachers`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(get.status).toBe(200);
        expect(get.body).toHaveProperty('teachers');
        expect(get.body.teachers).toHaveLength(waitingRoomLength);
    });
    it ('check all teachers', async () => {
        const get = await request(index)
            .get(`/classes/${classId}/teachers`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(get.status).toBe(200);
        expect(get.body).toHaveProperty('teachers');
        expect(get.body.teachers).toHaveLength(teacherLength);
    });
});

describe.skip("Waitingroomteacher post->delete lifecycle", () => {
    it ('get all waitingroomteachers', async () => {
        const res = await request(index)
            .get(`/classes/${classId}/waitingroom/teachers`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('teachers');
        expect(res.body.teachers).toHaveLength(waitingRoomLength);
    });

    it ('get all teachers', async () => {
        const res = await request(index)
            .get(`/classes/${classId}/teachers`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('teachers');
        expect(res.body.teachers).toHaveLength(teacherLength);
    });

    it ("post waitingroomteacher", async () => {
        const post = await request(index)
            .post(`/classes/${classId}/waitingroom/teachers`)
            .send({teacher: "/teachers/3"})
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(post.status).toBe(200);
    });

    it ("get all waitingroomteachers", async () => {
        const res = await request(index)
            .get(`/classes/${classId}/waitingroom/teachers`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('teachers');
        expect(res.body.teachers).toHaveLength(waitingRoomLength + 1);
    });
    it ('get all teachers', async () => {
        const res = await request(index)
            .get(`/classes/${classId}/teachers`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('teachers');
        expect(res.body.teachers).toHaveLength(teacherLength);
    });


    it ('delete waitingroomteacher', async () => {
        const del = await request(index)
            .delete(`/classes/${classId}/waitingroom/teachers/3`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(del.status).toBe(200);
    });

    it ('check all waitingroomteachers', async () => {
        const get = await request(index)
            .get(`/classes/${classId}/waitingroom/teachers`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(get.status).toBe(200);
        expect(get.body).toHaveProperty('teachers');
        expect(get.body.teachers).toHaveLength(waitingRoomLength);
    });
    it ('check all teachers', async () => {
        const get = await request(index)
            .get(`/classes/${classId}/teachers`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(get.status).toBe(200);
        expect(get.body).toHaveProperty('teachers');
        expect(get.body.teachers).toHaveLength(teacherLength);
    });
});

describe.skip("Waitingroomteacher get edgecases", () => {
    it("invalid classId", async () => {
        const res = await request(index)
            .get(`/classes/invalid/waitingroom/teachers`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
    })

    it("no auth", async () => {
        const res = await request(index)
            .get(`/classes/${classId}/teachers`);

        expect(res.status).toBe(401);
    })
});

describe.skip("Waitingroomteacher post edgecases", () => {
    it("invalid classId", async () => {
        const res = await request(index)
            .post(`/classes/invalid/waitingroom/teachers`)
            .send({teacher: "/teachers/3"})
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
    })

    it ("invalid teacher", async () => {
        const res = await request(index)
            .post(`/classes/${classId}/waitingroom/teachers`)
            .send({teacher: "/teachers/invalid"})
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
    });

    it("no auth", async () => {
        const res = await request(index)
            .post(`/classes/${classId}/waitingroom/teachers`)
            .send({teacher: "/teachers/3"});

        expect(res.status).toBe(401);
    })
});

describe.skip("Waitingroomteacher patch edgecases", () => {
    it("invalid classId", async () => {
        const res = await request(index)
            .patch(`/classes/invalid/waitingroom/teachers/3`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
    })

    it("invalid teacherId", async () => {
        const res = await request(index)
            .patch(`/classes/${classId}/waitingroom/teachers/invalid`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
    })

    it("no auth", async () => {
        const res = await request(index)
            .patch(`/classes/${classId}/waitingroom/teachers/3`);

        expect(res.status).toBe(401);
    })
})

describe.skip("Waitingroomteacher delete edgecases", () => {
    it("invalid classId", async () => {
        const res = await request(index)
            .delete(`/classes/invalid/waitingroom/teachers/3`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
    })

    it("invalid teacherId", async () => {
        const res = await request(index)
            .delete(`/classes/${classId}/waitingroom/teachers/invalid`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
    })

    it("no auth", async () => {
        const res = await request(index)
            .delete(`/classes/${classId}/waitingroom/teachers/3`);

        expect(res.status).toBe(401);
    })
});
