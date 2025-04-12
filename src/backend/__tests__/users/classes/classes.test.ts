import request from "supertest";
import {beforeAll, describe, expect, it} from "vitest";
import index from "../../../index.ts";

let teacherAuthToken: string;

let studentAuthToken: string;

beforeAll(async () => {
    const studentLoginPayload = {
        email: 'student1@example.com',
        password: 'test'
    };

    let res = await request(index).post("/authentication/login").send(studentLoginPayload);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");

    studentAuthToken = res.body.token;

    const loginPayload = {
        email: 'teacher1@example.com',
        password: 'test'
    };

    res = await request(index).post("/authentication/login").send(loginPayload);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");

    teacherAuthToken = res.body.token;
})

describe("user classes",()=>{
    describe.skip("student classes", () => {
        it("krijg lijst van classes", async () => {
            const studentId = 4;

            const res = await request(index)
                .get(`/users/${studentId}/classes`)
                .set("Authorization", `Bearer ${studentAuthToken.trim()}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("classes");
            expect(res.body.classes).toHaveLength(3);
            expect(res.body).toEqual({
                classes: [
                    `/classes/1`,
                    `/classes/2`,
                    `/classes/3`
                ]
            });
        });

        it("moet statuscode 400 terug geven bij een ongeldig studentId", async () => {
            const studentId = "aaaa";

            const res = await request(index)
                .get(`/users/${studentId}/classes`)
                .set("Authorization", `Bearer ${studentAuthToken.trim()}`);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({error: "invalid userId"});
        });
    });

    describe.skip("teacher classes", () => {
        it("krijg lijst van classes voor een teacher", async () => {
            const teacherId = 1;

            // get the classes of the teacher
            const res = await request(index)
                .get(`/teachers/${teacherId}/classes`)
                .set("Authorization", `Bearer ${teacherAuthToken.trim()}`);

            expect(res.status).toBe(200);
            expect(res.body.classes).toHaveLength(3);
            expect(res.body).toEqual({
                classes: [
                    `/classes/1`,
                    `/classes/3`,
                    `/classes/4`
                ]
            });
        });

        it("moet statuscode 400 terug geven bij een ongeldig teacherId", async () => {
            const teacherId = "aaaa";
            const res = await request(index)
                .get(`/teachers/${teacherId}/classes`)
                .set("Authorization", `Bearer ${teacherAuthToken.trim()}`);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({error: "invalid userId"});
        });
    });
});
