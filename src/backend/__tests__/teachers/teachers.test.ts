import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";
import index from "../../index.ts";

let authToken: string;
let userURL : string;

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
    userURL = res.body.user;
});

describe("Teacher Endpoints", () => {
    describe("GET /teachers/:id", () => {
        it("should return teacher name with status code 200", async () => {
            const res = await request(index)
                .get(`${userURL}`)
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
        it("should return status code 200 when teacher is successfully deleted", async () => {
            const res = await request(index)
                .delete(`${userURL}`)
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
