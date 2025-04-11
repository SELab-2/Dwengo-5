import request from "supertest";
import { beforeAll, describe, expect, it, test } from "vitest";
import index from "../../index.ts";

let authToken;

beforeAll(async () => {
    const loginPayload = {
        email: "student1@example.com",
        password: "test"
    };

    const res = await request(index)
        .post("/authentication/login?usertype=student")
        .send(loginPayload);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");

    authToken = res.body.token;
});

describe("Student Endpoints", () => {
    describe("GET /students/:id", () => {
        it("should return student name with status code 200", async () => {
            const studentId = 1;
            const res = await request(index)
                .get(`/students/${studentId}`)
                .set("Authorization", `Bearer ${authToken.trim()}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("name", "student_one");
        });

        it("should return status code 400 for an invalid student ID", async () => {
            const res = await request(index)
                .get("/students/abc")
                .set("Authorization", `Bearer ${authToken.trim()}`);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: "invalid studentId" });
        });
    });

    describe("DELETE /students/:id", () => {
        it("should return status code 200 when student is successfully deleted", async () => {
            const studentId = 1;
            const res = await request(index)
                .delete(`/students/${studentId}`)
                .set("Authorization", `Bearer ${authToken.trim()}`);

            expect(res.status).toBe(200);
        });

        it("should return status code 400 for an invalid student ID", async () => {
            const res = await request(index)
                .delete("/students/abc")
                .set("Authorization", `Bearer ${authToken.trim()}`);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: "invalid userId" }); // returns this error because of middleware
        });
    });
});