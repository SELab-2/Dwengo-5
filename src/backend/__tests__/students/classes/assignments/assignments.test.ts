import request from "supertest";
import {beforeAll, describe, expect, it} from "vitest";
import index from "../../../../index.ts";


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

describe("students/:studentId/classes/:classId/assignments", () => {
    it("krijg lijst van assignments", async () => {
        let res = await request(index).get("/students/1/classes/1/assignments").set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(200);
        expect(res.body.assignments[0]).toBe("/assignments/1");
        expect(res.body.assignments).toHaveLength(1)
    });

    it("no authoriazation because of invalid Id", async () => {
        let res = await request(index).get("/students/xxxx/classes/1/assignments").set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
    });

    it("class not found", async () => {
        let res = await request(index).get("/students/1/classes/50/assignments").set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(404);
    });

    it("invalid class Id", async () => {
        let res = await request(index).get("/students/1/classes/hhhhhh/assignments").set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
    });
});