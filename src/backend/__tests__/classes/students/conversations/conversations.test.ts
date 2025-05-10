import request from "supertest";
import {beforeAll, afterAll,describe, expect, it, vi} from "vitest";
import index, {prisma} from '../../../../index.ts';

vi.mock("../prismaClient", () => ({
    classStudent: {
        findMany: vi.fn()
    }
}));

let authToken: string;

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


describe.skip("studentConversaties", () => {
    beforeAll(async () => {
        await prisma.$executeRaw`BEGIN`;
    });

    afterAll(async () => {
        await prisma.$executeRaw`ROLLBACK`;
    });

    it("moet een lijst van conversations teruggeven met statuscode 200", async () => {
        const classId: number = 1;
        const studentId: number = 1;
        const groepId: number = 1;

                const res = await request(index)
            .get(`/classes/${classId}/students/${studentId}/conversations`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

                expect(res.status).toBe(200);
        expect(res.body.conversations).toHaveLength(2);
        expect(res.body).toEqual({
            conversations: [
                `/classes/${classId}/assignments/1/groups/${groepId}/conversations/1`,
                `/classes/${classId}/assignments/1/groups/${groepId}/conversations/2`
            ]
        });
    });

    it("moet een lege lijst teruggeven als er geen conversations voor de student zijn", async () => {
        const classId: number = 1;
        const studentId: number = 2;

                const res = await request(index)
            .get(`/classes/${classId}/students/${studentId}/conversations`)
            .set("Authorization", `Bearer ${authToken}`);

                expect(res.status).toBe(200);
        expect(res.body.conversations).toHaveLength(0);
        expect(res.body).toEqual({
            conversations: []
        });
    });

    it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
        const studentId: number = 1;

                const res = await request(index)
            .get(`/classes/abc/students/${studentId}/conversations`)
            .set("Authorization", `Bearer ${authToken}`);

                expect(res.status).toBe(400);
        expect(res.body).toEqual({"error": "invalid classId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig studentId", async () => {
        const classId: number = 1;

                const res = await request(index)
            .get(`/classes/${classId}/students/abc/conversations`)
            .set("Authorization", `Bearer ${authToken}`);

                expect(res.status).toBe(400);
        expect(res.body).toEqual({"error": "invalid studentId"});
    });
});
