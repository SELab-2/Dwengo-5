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

    const response = await request(index).post("/authentication/login?usertype=student").send(loginPayload);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");

    authToken = response.body.token;
});


// GET /students/:studentId
describe("student", () => {
    it("moet de naam van de student teruggeven met statuscode 200", async () => {
        const studentId: number = 1;

        // verstuur het GET request
        let res = await request(index)
            .get(`/students/${studentId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("name");
        expect(res.body.name).toBe("student_one");
    });

    it("moet statuscode 400 terug geven bij een ongeldig studentId", async () => {
        // verstuur het GET request
        let res = await request(index)
            .get(`/students/abc`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(res.status).toBe(400);
        expect(res.body).toEqual({error: "invalid studentId"});
    });
});


// DELETE /students/:studentId
describe("verwijderLeerling", () => {
    it("moet statuscode 200 teruggeven als het verwijderen lukt", async () => {
        const studentId: number = 1;

        // verstuur het DELETE request
        let res = await request(index)
            .delete(`/students/${studentId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("name");
        expect(res.body.name).toBe("student1");
    });

    it("moet statuscode 400 terug geven bij een ongeldig studentId", async () => {
        // verstuur het DELETE request
        let res = await request(index)
            .delete(`/students/abc`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(res.status).toBe(400);
        expect(res.body).toEqual({error: "invalid studentId"});
    });
});