import request from "supertest";
import {beforeAll, describe, expect, it} from "vitest";
import index from "../../../index.ts";


let authToken: string;

beforeAll(async () => {
    // Perform login as student1
    const loginPayload = {
        email: 'student1@example.com',
        password: 'test'
    };

    const response = await request(index).post("/authenticatie/aanmelden?gebruikerstype=leerling").send(loginPayload);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");

    authToken = response.body.token;
});

// GET /students/:studentId/classes
describe("leerlingKlassen", () => {
    it("krijg lijst van classes", async () => {
        const studentId = 1;

        const res = await request(index)
            .get(`/leerlingen/${studentId}/klassen`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("klassen");
        expect(res.body.klassen).toHaveLength(3);
        expect(res.body).toEqual({
            klassen: [
                `/klassen/1`,
                `/klassen/2`,
                `/klassen/3`,
            ]
        });
    });

    it("moet statuscode 400 terug geven bij een ongeldig studentId", async () => {
        const studentId = "aaaa";

        const res = await request(index)
            .get(`/leerlingen/${studentId}/klassen`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({error: "invalid studentId"});
    });
});
