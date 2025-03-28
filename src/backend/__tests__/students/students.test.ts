import request from "supertest";
import {beforeAll, describe, expect, it} from "vitest";
import index from '../../index.ts';

let authToken: string;

beforeAll(async () => {
    // Perform login as student1
    const loginPayload = {
        email: 'student1@example.com',
        password: 'test'
    };

    const res = await request(index).post("/authentication/login?usertype=student").send(loginPayload);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");

    authToken = res.body.token;
});


describe("student", () => {
    it("moet de naam van de student teruggeven met statuscode 200", async () => {
        const studentId: number = 1;

        let res = await request(index)
            .get(`/students/${studentId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("name");
        expect(res.body.name).toBe("student_one");
    });

    it("moet statuscode 400 terug geven bij een ongeldig studentId", async () => {
        let res = await request(index)
            .get(`/students/abc`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({error: "invalid studentId"});
    });
});


describe("verwijderLeerling", () => {
    it("moet statuscode 200 teruggeven als het verwijderen lukt", async () => {
        const studentId: number = 1;

        let res = await request(index)
            .delete(`/students/${studentId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(200);
    });

    it("should return status code 400 at invalud studentId", async () => {
        let res = await request(index)
            .delete(`/students/abc`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({error: "invalid userId"});
    });
});