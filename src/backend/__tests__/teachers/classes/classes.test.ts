import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import index from '../../../index.ts';

let authToken: string;

beforeAll(async () => {
    // Perform login as teacher1
    const loginPayload = {
        email: 'teacher1@example.com',
        password: 'test'
    };

    const res = await request(index).post("/authentication/login?usertype=teacher").send(loginPayload);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");

    authToken = res.body.token;
});



describe.skip("teacherKlassen", () => {
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
        expect(res.body).toEqual({error: "invalid userId"});
    });
});