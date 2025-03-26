import request from "supertest";
import {beforeAll, describe, expect, it, vi} from "vitest";
import index from "../../../index.ts";

vi.mock("../prismaClient", () => ({
    classStudent: {
        findMany: vi.fn(),
    },
}));


let authToken: string;
let studentLength: number;
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


describe("klasleerlingen initial state", () => {
    it('initial state', async () => {
        const res = await request(index)
            .get(`/classes/${classId}/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(200);
        expect(res.body.students).toHaveLength(2);
        expect(res.body).toHaveProperty('students');
        expect(res.body).toHaveProperty('waitingroom');

        studentLength = res.body.students.length;
        waitingRoomLength = res.body.waitingroom.length;
    });
});

describe("klasLeerling lifecycle", () => {
    it ("post klasLeerling", async () => {
        const post = await request(index)
            .post(`/classes/${classId}/students`)
            .send({student: "/students/3"})
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(post.status).toBe(200);
    });

    it ("get all klasLeerlingen", async () => {
        const res = await request(index)
            .get(`/classes/${classId}/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(200);
        expect(res.body.students).toHaveLength(studentLength);
        expect(res.body.waitingroom).toHaveLength(waitingRoomLength + 1);
    })

    it ("patch klasLeerling", async () => {
        const patch = await request(index)
            .patch(`/classes/${classId}/students/3`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(patch.status).toBe(200);
    });

    it ("check new klasLeerlingen", async () => {
        const res = await request(index)
            .get(`/classes/${classId}/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(200);
        expect(res.body.students).toHaveLength(studentLength + 1);
        expect(res.body.waitingroom).toHaveLength(waitingRoomLength);
    })

    it ("delete klasLeerling", async () => {
        const del = await request(index)
            .delete(`/classes/${classId}/students/3`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(del.status).toBe(200);
    })

    it ("check deleted klasLeerling", async () => {
        const res = await request(index)
            .get(`/classes/${classId}/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(200);
        expect(res.body.students).toHaveLength(studentLength);
        expect(res.body.waitingroom).toHaveLength(waitingRoomLength);
    })
});

describe("get ClassStudents edgecases ", () => {
    it("invalid classid", async () => {
                const res = await request(index)
            .get("/classes/abc/students")
            .set("Authorization", `Bearer ${authToken.trim()}`);

                expect(res.status).toBe(400);
        expect(res.body).toEqual({error: "invalid classId"});
    });
})

describe("post ClassStudents edgecases ", () => {
    it ('invalid classId', async () => {
        const studentData = {student: "/students/3"};
        const res = await request(index)
            .post("/classes/abc/students")
            .send(studentData)
            .set("Authorization", `Bearer ${authToken.trim()}`);

                expect(res.status).toBe(400);
        expect(res.body).toEqual({error: "invalid classId"});
    });

    it("invalid student", async () => {
        const classId: number = 1;
        const studentData = {student: "/students/abc"};

                const res = await request(index)
            .post(`/classes/${classId}/students`)
            .send(studentData)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
    });
})


describe("delete ClassStudent edgecases ", () => {
    it("invalid classId", async () => {
        const res = await request(index)
            .delete("/classes/abc/students/123")
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({error: "invalid classId"});
    });

    it("invalid studentId", async () => {
        const res = await request(index)
            .delete(`/classes/${classId}/students/abc`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({error: "invalid studentId"});
    });

    it("student not found", async () => {
        const classId: number = 1;
        const studentId: number = 10;
        const res = await request(index)
            .delete(`/classes/${classId}/students/${studentId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

                expect(res.status).toBe(404);
        expect(res.body).toEqual({
            error: `student not found`,
        });
    });
})

describe("patch ClassStudent edgecases ", () => {
    it("invalid classId", async () => {
        const res = await request(index)
            .patch("/classes/abc/students/123")
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({error: "invalid classId"});
    });

    it("invalid studentId", async () => {
        const res = await request(index)
            .patch(`/classes/${classId}/students/abc`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({error: "invalid student"});
    });
})

