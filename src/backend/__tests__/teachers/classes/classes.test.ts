import request from "supertest";
import {beforeAll, describe, expect, expectTypeOf, it} from "vitest";
import index from '../../../index.ts';

let authToken: string;
let userURL: string;

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
    userURL = res.body.user;
});



describe("teacherKlassen", () => {
    it("Should return list of classes for teacher", async () => {
        const teacherId = 1;

        // get the classes of the teacher
        const res = await request(index)
            .get(`${userURL}/classes`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(200);
        expectTypeOf(res.body.classes).toEqualTypeOf({x: []});
        //expect(res.body.classes).toHaveLength(3);
        //expect(res.body).toEqual({
        //    classes: [
        //        `/classes/1`,
        //        `/classes/3`,
        //        `/classes/4`,
        //    ]
        //});
    });

    it("Should return 400 for invalid teacherId", async () => {
        const teacherId = "aaaa";
        const res = await request(index)
            .get(`/teachers/${teacherId}/classes`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({error: "invalid userId"});
    });
});