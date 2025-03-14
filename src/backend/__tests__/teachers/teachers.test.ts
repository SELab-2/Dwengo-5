import request from "supertest";
import {beforeAll, describe, expect, it} from "vitest";
import index from '../../index.ts';

let authToken: string;

beforeAll(async () => {
    // Perform login as teacher1
    const loginPayload = {
        email: 'teacher1@example.com',
        password: 'test'
    };

    const response = await request(index).post("/authenticatie/aanmelden?gebruikerstype=leerkracht").send(loginPayload);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");

    authToken = response.body.token;
});


// GET /teachers/:teacherstudentId
describe("leerling", () => {
    it("moet de naam van de leerling teruggeven met statuscode 200", async () => {
        const teacherId: number = 1;

        // verstuur het GET request
        let res = await request(index)
            .get(`/leerkrachten/${teacherId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("name");
        expect(res.body.name).toBe("teacher_one");
    });

    it("moet statuscode 400 terug geven bij een ongeldig teacherId", async () => {
        // verstuur het GET request
        let res = await request(index)
            .get(`/leerkrachten/abc`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(res.status).toBe(400);
        expect(res.body).toEqual({error: "invalid teacherId"});
    });
});


// DELETE /teachers/:teacherstudentId
describe("verwijderLeerling", () => {
    it("moet statuscode 200 teruggeven als het verwijderen lukt", async () => {
        const teacherId: number = 1;

        // verstuur het DELETE request
        let res = await request(index)
            .delete(`/leerkrachten/${teacherId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("name");
        expect(res.body.name).toBe("student1");
    });

    it("moet statuscode 400 terug geven bij een ongeldig teacherId", async () => {
        // verstuur het DELETE request
        let res = await request(index)
            .delete(`/leerkrachten/abc`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(res.status).toBe(400);
        expect(res.body).toEqual({error: "invalid teacherId"});
    });
});