import request from "supertest";
import { beforeAll, afterAll,describe, expect, it } from "vitest";
import index, {prisma} from "../../index.ts";

let authToken: string;

beforeAll(async () => {
    const loginPayload = {
        email: "teacher1@example.com",
        password: "test",
    };

    const res = await request(index)
        .post("/authentication/login?usertype=teacher")
        .send(loginPayload);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");

    authToken = res.body.token;
});

describe("Teacher Endpoints", () => {
  beforeAll(async () => {
    await prisma.$executeRaw`BEGIN`;
  });

  afterAll(async () => {
    await prisma.$executeRaw`ROLLBACK`;
  });
    describe("GET /teachers/:id", () => {
  beforeAll(async () => {
    await prisma.$executeRaw`BEGIN`;
  });

  afterAll(async () => {
    await prisma.$executeRaw`ROLLBACK`;
  });
        it("should return teacher name with status code 200", async () => {
            const teacherId = 1;
            const res = await request(index)
                .get(`/teachers/${teacherId}`)
                .set("Authorization", `Bearer ${authToken.trim()}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("name", "teacher_one");
        });

        it("should return status code 400 for an invalid teacher ID", async () => {
            const res = await request(index)
                .get("/teachers/abc")
                .set("Authorization", `Bearer ${authToken.trim()}`);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: "invalid teacherId" });
        });
    });

    describe("DELETE /teachers/:id", () => {
  beforeAll(async () => {
    await prisma.$executeRaw`BEGIN`;
  });

  afterAll(async () => {
    await prisma.$executeRaw`ROLLBACK`;
  });
        it("should return status code 200 when teacher is successfully deleted", async () => {
            const teacherId = 1;
            const res = await request(index)
                .delete(`/teachers/${teacherId}`)
                .set("Authorization", `Bearer ${authToken.trim()}`);

            expect(res.status).toBe(200);
        });

        it("should return status code 400 for an invalid teacher ID", async () => {
            const res = await request(index)
                .delete("/teachers/abc")
                .set("Authorization", `Bearer ${authToken.trim()}`);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: "invalid userId" }); // returns this error because of middleware
        });
    });
});
