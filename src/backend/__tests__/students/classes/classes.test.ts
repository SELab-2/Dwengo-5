import request from "supertest";
import {beforeAll, afterAll,describe, expect, it} from "vitest";
import index, {prisma} from "../../../index.ts";


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


describe("studentKlassen", () => {
    beforeAll(async () => {
        await prisma.$executeRaw`BEGIN`;
    });

    afterAll(async () => {
        await prisma.$executeRaw`ROLLBACK`;
    });
    it("krijg lijst van classes", async () => {
        const studentId = 1;

        const res = await request(index)
            .get(`/students/${studentId}/classes`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("classes");
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
