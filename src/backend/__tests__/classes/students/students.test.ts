import request from "supertest";
import {beforeAll, afterAll,describe, expect, it, vi} from "vitest";
import index, {prisma} from "../../../index.ts";

let authToken: string;
const classId = 1;

beforeAll(async () => {
    // Perform login as teacher1
    const loginPayload = {
        email: "teacher1@example.com",
        password: "test",
    };

    const res = await request(index).post("/authentication/login?usertype=teacher").send(loginPayload);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");

    authToken = res.body.token;
});


describe("ClassStudent edgecases", () => {
    beforeAll(async () => {
        await prisma.$executeRaw`BEGIN`;
    });

    afterAll(async () => {
        await prisma.$executeRaw`ROLLBACK`;
    });

    it("invalid classId", async () => {
        const res = await request(index)
            .get("/classes/abc/students")
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(res.status).toBe(400);
    });
    it ("no auth", async () => {
        const res = await request(index)
            .get(`/classes/${classId}/students`);
        expect(res.status).toBe(401);
    });
});
