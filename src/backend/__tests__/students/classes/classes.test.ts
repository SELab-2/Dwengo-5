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

    const res = await request(index).post("/authentication/login?usertype=student").send(loginPayload);

    // expect(res.status).toBe(200);
    // expect(res.body).toHaveProperty("token");
    //
    // authToken = res.body.token;
});


describe.skip("studentKlassen", () => {
    it("krijg lijst van classes", async () => {
        const studentId = 1;

        const res = await request(index)
            .get(`/students/${studentId}/classes`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("classes");
        expect(res.body.classes).toHaveLength(3);
        expect(res.body).toEqual({
            classes: [
                `/classes/1`,
                `/classes/2`,
                `/classes/3`,
            ]
        });
    });

    it("moet statuscode 400 terug geven bij een ongeldig studentId", async () => {
        const studentId = "aaaa";

        const res = await request(index)
            .get(`/students/${studentId}/classes`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({error: "invalid userId"});
    });
});
