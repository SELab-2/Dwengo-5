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

    const response = await request(index).post("/authenticatie/aanmelden?gebruikerstype=leerkracht").send(loginPayload);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");

    authToken = response.body.token;
});

// GET /classes/:classId/students/:studentId/conversations
describe("leerlingConversaties", () => {
    it("moet een lijst van conversations teruggeven met statuscode 200", async () => {
        const classId: number = 1;
        const studentId: number = 1;
        const groepId: number = 1;

        // verstuur het GET request
        const response = await request(index)
            .get(`/klassen/${classId}/leerlingen/${studentId}/conversaties`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(200);
        expect(response.body.conversaties).toHaveLength(2);
        expect(response.body).toEqual({
            conversaties: [
                `/klassen/${classId}/opdrachten/1/groepen/${groepId}/conversaties/1`,
                `/klassen/${classId}/opdrachten/1/groepen/${groepId}/conversaties/2`,
            ]
        });
    });

    it("moet een lege lijst teruggeven als er geen conversations voor de leerling zijn", async () => {
        const classId: number = 1;
        const studentId: number = 2;

        // verstuur het GET request
        const response = await request(index)
            .get(`/klassen/${classId}/leerlingen/${studentId}/conversaties`)
            .set("Authorization", `Bearer ${authToken}`);

        // controlleer de response
        expect(response.status).toBe(200);
        expect(response.body.conversaties).toHaveLength(0);
        expect(response.body).toEqual({
            conversaties: []
        });
    });

    it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
        const studentId: number = 1;

        // verstuur het GET request
        const response = await request(index)
            .get(`/klassen/abc/leerlingen/${studentId}/conversaties`)
            .set("Authorization", `Bearer ${authToken}`);

        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid classId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig studentId", async () => {
        const classId: number = 1;

        // verstuur het GET request
        const response = await request(index)
            .get(`/klassen/${classId}/leerlingen/abc/conversaties`)
            .set("Authorization", `Bearer ${authToken}`);

        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid studentId"});
    });
});
