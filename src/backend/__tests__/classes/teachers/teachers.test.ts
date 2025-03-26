import request from "supertest";
import {beforeAll, describe, expect, it, vi} from "vitest";
import index from "../../../index.ts";

vi.mock("../prismaClient", () => ({
    classteacher: {
        findMany: vi.fn(),
    },
}));


let authToken: string;
let teacherLength: number;
let waitingRoomLength: number;
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


describe("klasleerkrachten initial state", () => {
    it('initial state', async () => {
        const res = await request(index)
            .get(`/classes/${classId}/teachers`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(200);
        expect(res.body.teachers).toHaveLength(2);
        expect(res.body).toHaveProperty('teachers');
        expect(res.body).toHaveProperty('waitingroom');

        teacherLength = res.body.teachers.length;
        waitingRoomLength = res.body.waitingroom.length;
    });
});

describe("klasleerkracht lifecycle", () => {
    it ("post klasleerkracht", async () => {
        const post = await request(index)
            .post(`/classes/${classId}/teachers`)
            .send({teacher: "/teachers/3"})
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(post.status).toBe(200);
    });

    it ("get all klasleerkrachten", async () => {
        const res = await request(index)
            .get(`/classes/${classId}/teachers`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(200);
        expect(res.body.teachers).toHaveLength(teacherLength);
        expect(res.body.waitingroom).toHaveLength(waitingRoomLength + 1);
    })

    it ("patch klasleerkracht", async () => {
        const patch = await request(index)
            .patch(`/classes/${classId}/teachers/3`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(patch.status).toBe(200);
    });

    it ("check new klasleerkrachten", async () => {
        const res = await request(index)
            .get(`/classes/${classId}/teachers`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(200);
        expect(res.body.teachers).toHaveLength(teacherLength + 1);
        expect(res.body.waitingroom).toHaveLength(waitingRoomLength);
    })

    it ("delete klasleerkracht", async () => {
        const del = await request(index)
            .delete(`/classes/${classId}/teachers/3`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(del.status).toBe(200);
    })

    it ("check deleted klasleerkracht", async () => {
        const res = await request(index)
            .get(`/classes/${classId}/teachers`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(200);
        expect(res.body.teachers).toHaveLength(teacherLength);
        expect(res.body.waitingroom).toHaveLength(waitingRoomLength);
    })
});

describe("get Classteachers edgecases ", () => {
    it("invalid classid", async () => {
        const res = await request(index)
            .get("/classes/abc/teachers")
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({error: "invalid classId"});
    });
})

describe("post Classteachers edgecases ", () => {
    it ('invalid classId', async () => {
        const teacherData = {teacher: "/teachers/3"};
        const res = await request(index)
            .post("/classes/abc/teachers")
            .send(teacherData)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({error: "invalid classId"});
    });

    it("invalid teacher", async () => {
        const classId: number = 1;
        const teacherData = {teacher: "/teachers/abc"};

        const res = await request(index)
            .post(`/classes/${classId}/teachers`)
            .send(teacherData)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
    });
})


describe("delete Classteacher edgecases ", () => {
    it("invalid classId", async () => {
        const res = await request(index)
            .delete("/classes/abc/teachers/123")
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({error: "invalid classId"});
    });

    it("invalid teacherId", async () => {
        const res = await request(index)
            .delete(`/classes/${classId}/teachers/abc`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({error: "invalid teacherId"});
    });

    it("teacher not found", async () => {
        const classId: number = 1;
        const teacherId: number = 10;
        const res = await request(index)
            .delete(`/classes/${classId}/teachers/${teacherId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(404);
        expect(res.body).toEqual({
            error: `teacher not found`,
        });
    });
})

describe("patch Classteacher edgecases ", () => {
    it("invalid classId", async () => {
        const res = await request(index)
            .patch("/classes/abc/teachers/123")
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({error: "invalid classId"});
    });

    it("invalid teacherId", async () => {
        const res = await request(index)
            .patch(`/classes/${classId}/teachers/abc`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({error: "invalid teacher"});
    });
})

