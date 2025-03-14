import request from "supertest";
import {beforeAll, describe, expect, it, vi} from "vitest";
import index from "../../../index.ts";

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

// GET /classes/{classId}/conversations
describe("opdrachtConversaties", () => {
    it("moet een lijst van conversations teruggeven met statuscode 200", async () => {
        const classId: number = 1;

        // verstuur het GET request
        const response = await request(index)
            .get(`/klassen/${classId}/conversaties`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(200);
        expect(response.body.conversaties).toHaveLength(3);
        expect(response.body).toEqual({
            conversaties: [
                `/klassen/${classId}/opdrachten/1/groepen/1/conversaties/1`,
                `/klassen/${classId}/opdrachten/1/groepen/1/conversaties/2`,
                `/klassen/${classId}/opdrachten/4/groepen/4/conversaties/3`,
            ]
        });
    });

    it("moet een lege lijst teruggeven als er geen conversations voor de opdracht zijn", async () => {
        const classId: number = 3;

        // verstuur het GET request
        const response = await request(index)
            .get(`/klassen/${classId}/conversaties`)
            .set("Authorization", `Bearer ${authToken}`);

        // controlleer de response
        expect(response.status).toBe(200);
        expect(response.body.conversaties).toHaveLength(0);
        expect(response.body).toEqual({
            conversaties: []
        });
    });

    it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
        // verstuur het GET request
        const response = await request(index)
            .get(`/klassen/abc/conversaties`)
            .set("Authorization", `Bearer ${authToken}`);

        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid classId"});
    });
});
