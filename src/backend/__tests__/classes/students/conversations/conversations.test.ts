import request from "supertest";
import {beforeAll, describe, expect, it, vi} from "vitest";
import index from '../../../../index.ts';

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
        password: "test",
    };

    const response = await request(index).post("/authentication/login?usertype=teacher").send(loginPayload);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");

    authToken = response.body.token;
});

// GET /classes/:classId/students/:studentId/conversations
describe("studentConversaties", () => {
    it("moet een lijst van conversations teruggeven met statuscode 200", async () => {
        const classId: number = 1;
        const studentId: number = 1;
        const groepId: number = 1;

        // verstuur het GET request
        const response = await request(index)
            .get(`/classes/${classId}/students/${studentId}/conversations`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(200);
        expect(response.body.conversations).toHaveLength(2);
        expect(response.body).toEqual({
            conversations: [
                `/classes/${classId}/assignments/1/groups/${groepId}/conversations/1`,
                `/classes/${classId}/assignments/1/groups/${groepId}/conversations/2`,
            ]
        });
    });

    it("moet een lege lijst teruggeven als er geen conversations voor de student zijn", async () => {
        const classId: number = 1;
        const studentId: number = 2;

        // verstuur het GET request
        const response = await request(index)
            .get(`/classes/${classId}/students/${studentId}/conversations`)
            .set("Authorization", `Bearer ${authToken}`);

        // controlleer de response
        expect(response.status).toBe(200);
        expect(response.body.conversations).toHaveLength(0);
        expect(response.body).toEqual({
            conversations: []
        });
    });

    it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
        const studentId: number = 1;

        // verstuur het GET request
        const response = await request(index)
            .get(`/classes/abc/students/${studentId}/conversations`)
            .set("Authorization", `Bearer ${authToken}`);

        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid classId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig studentId", async () => {
        const classId: number = 1;

        // verstuur het GET request
        const response = await request(index)
            .get(`/classes/${classId}/students/abc/conversations`)
            .set("Authorization", `Bearer ${authToken}`);

        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid studentId"});
    });
});
