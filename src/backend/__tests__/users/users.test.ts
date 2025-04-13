import request from "supertest";
import {beforeAll, describe, expect, it} from "vitest";
import index from "../../index.ts";
import {getSeedData, seedData, seedStudent, seedTeacher} from "../../prisma/seed.ts";

let studentAuthToken: string;
let teacherAuthToken: string;
let seedData: seedData;
let teacher: seedTeacher;
let student: seedStudent;
beforeAll(async () => {
    seedData = await getSeedData();
    console.log(seedData)
    teacher = seedData.teachers[0];
    student = seedData.students[0];

    let res = await request(index)
        .post("/authentication/login")
        .send({
            email: teacher.email,
            password: teacher.password,
        });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");

    teacherAuthToken = res.body.token;

    res = await request(index)
        .post("/authentication/login")
        .send({
            email: student.email,
            password: student.password,
        });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");

    studentAuthToken = res.body.token;
});

describe("user Endpoints", () => {

    describe("GET /users/:id", () => {
        it("should return teacher name with status code 200", async () => {
            const res = await request(index)
                .get(`/users/${(teacher.id)}`)
                .set("Authorization", `Bearer ${teacherAuthToken.trim()}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("name", teacher.username);
        });

        it("should return status code 400 for an invalid teacher ID", async () => {
            const res = await request(index)
                .get("/users/abc")
                .set("Authorization", `Bearer ${teacherAuthToken.trim()}`);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({error: "invalid userId"});
        });
        it("should return student name with status code 200", async () => {
            const res = await request(index)
                .get(`/users/${student.id}`)
                .set("Authorization", `Bearer ${studentAuthToken.trim()}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("name", student.username);
        });

        it("should return status code 400 for an invalid student ID", async () => {
            const res = await request(index)
                .get("/users/abc")
                .set("Authorization", `Bearer ${studentAuthToken.trim()}`);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({error: "invalid userId"});
        });
    });

    describe("DELETE /users/:id", () => {
        it("should return status code 200 when teacher is successfully deleted", async () => {
            const res = await request(index)
                .delete(`/users/${teacher.id}`)
                .set("Authorization", `Bearer ${teacherAuthToken.trim()}`);

            expect(res.status).toBe(200);
        });

        it("should return status code 400 for an invalid teacher ID", async () => {
            const res = await request(index)
                .delete("/users/abc")
                .set("Authorization", `Bearer ${teacherAuthToken.trim()}`);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({error: "invalid userId"}); // returns this error because of middleware
        });

        it("should return status code 200 when student is successfully deleted", async () => {
            const res = await request(index)
                .delete(`/users/${student.id}`)
                .set("Authorization", `Bearer ${studentAuthToken.trim()}`);

            expect(res.status).toBe(200);
        });

        it("should return status code 400 for an invalid student ID", async () => {
            const res = await request(index)
                .delete("/users/abc")
                .set("Authorization", `Bearer ${studentAuthToken.trim()}`);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({error: "invalid userId"}); // returns this error because of middleware
        });
    });
});
