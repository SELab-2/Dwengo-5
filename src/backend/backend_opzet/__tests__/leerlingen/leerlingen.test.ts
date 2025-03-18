import request, {Response} from "supertest";
import {describe, expect, it, beforeAll} from "vitest";
import index from '../../index.ts';
import seedDatabase from '../../prisma/seedDatabase.ts';

let authToken: string;

beforeAll(async () => {
    await seedDatabase();
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


// GET /leerlingen/:leerling_id
describe("leerling", () => {
    it("moet de naam van de leerling teruggeven met statuscode 200", async () => {
        const studentId: number = 1;

        // verstuur het GET request
        let res = await request(index)
            .get(`/leerlingen/${studentId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("name");
        expect(res.body.name).toBe("student_one");
    });

    it("moet statuscode 400 terug geven bij een ongeldig studentId", async () => {
        // verstuur het GET request
        let res = await request(index)
            .get(`/leerlingen/abc`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: "invalid studentId" });
    });
});


// DELETE /leerlingen/:leerling_id
describe("verwijderLeerling", () => {
    it("moet statuscode 200 teruggeven als het verwijderen lukt", async () => {
        const studentId: number = 1;

        // verstuur het DELETE request
        let res = await request(index)
            .delete(`/leerlingen/${studentId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("name");
        expect(res.body.name).toBe("student1");
    });

    it("moet statuscode 400 terug geven bij een ongeldig studentId", async () => {
        // verstuur het DELETE request
        let res = await request(index)
            .delete(`/leerlingen/abc`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: "invalid studentId" });
    });
});