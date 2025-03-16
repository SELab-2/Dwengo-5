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

// GET /classes/:classId/assignments/:assignmentId/conversations
describe("opdrachtConversaties", () => {
    it("moet een lijst van conversations teruggeven met statuscode 200", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;
        const groepId: number = 1;

        // verstuur het GET request
        const response = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/conversations`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(200);
        expect(response.body.conversations).toHaveLength(2);
        expect(response.body).toEqual({
            conversations: [
                `/classes/${classId}/assignments/${assignmentId}/groepen/${groepId}/conversations/1`,
                `/classes/${classId}/assignments/${assignmentId}/groepen/${groepId}/conversations/2`,
            ]
        });
    });

    it("moet een lege lijst teruggeven als er geen conversations voor de opdracht zijn", async () => {
        const classId: number = 1;
        const assignmentId: number = 3;

        // verstuur het GET request
        const response = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/conversations`)
            .set("Authorization", `Bearer ${authToken}`);

        // controlleer de response
        expect(response.status).toBe(200);
        expect(response.body.conversations).toHaveLength(0);
        expect(response.body).toEqual({
            conversations: []
        });
    });

    it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
        const assignmentId: number = 123;

        // verstuur het GET request
        const response = await request(index)
            .get(`/classes/abc/assignments/${assignmentId}/conversations`)
            .set("Authorization", `Bearer ${authToken}`);

        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid classId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig assignmentId", async () => {
        const classId: number = 123;

        // verstuur het GET request
        const response = await request(index)
            .get(`/classes/${classId}/assignments/abc/conversations`)
            .set("Authorization", `Bearer ${authToken}`);

        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid assignmentId"});
    });

    // todo: find way to generate internal error
    /*
    it("moet statuscode 500 teruggeven bij een interne fout", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;

        // todo: simuleer een interne fout door de prisma methode te mocken
        vi.spyOn(prisma.conversation, 'findMany').mockRejectedValueOnce(new Error('Internal Error'));

        // verstuur het GET request
        const response = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/conversations`)
            .set("Authorization", `Bearer ${authToken}`);
        
        // controlleer de response
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "internal error" });
    });*/
});
