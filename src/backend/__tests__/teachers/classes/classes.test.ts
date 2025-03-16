import request from "supertest";
import {beforeAll, describe, expect, it} from "vitest";
import index from '../../../index.ts';

let authToken: string;

beforeAll(async () => {
    // Perform login as teacher1
    const loginPayload = {
        email: 'teacher1@example.com',
        password: 'test'
    };

    const response = await request(index).post("/authentication/login?usertype=teacher").send(loginPayload);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");

    authToken = response.body.token;
});


// GET /teachers/:teacher_id/classes
describe("teacherKlassen", () => {
    it("krijg lijst van classes voor een teacher", async () => {
        const teacherId = 1;

        // get the classes of the teacher
        const res = await request(index)
            .get(`/teachers/${teacherId}/classes`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(200);
        expect(res.body.classes).toHaveLength(3);
        expect(res.body).toEqual({
            classes: [
                `/classes/1`,
                `/classes/3`,
                `/classes/4`,
            ]
        });
    });

    it("moet statuscode 400 terug geven bij een ongeldig teacherId", async () => {
        const teacherId = "aaaa";
        const res = await request(index)
            .get(`/teachers/${teacherId}/classes`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({error: "invalid teacherId"});
    });
});