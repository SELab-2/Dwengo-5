import request, { Response } from "supertest";
import { beforeAll, describe, expect, it } from "vitest";
import index from '../../../index.ts';
import { getDbData, student, teacher } from "../../../prisma/seeddata.ts";
import { z } from "zod";
import { userLink } from "../../../help/links.ts";

let teacher: teacher & { password?: string };
let student: student & { password?: string };

beforeAll(async () => {
    let seeddata = await getDbData();
    teacher = seeddata.teachers[0];
    student = seeddata.students[0];
    teacher.password = seeddata.password_mappings[teacher.password];
    student.password = seeddata.password_mappings[student.password];
});


describe("Authentication - Login Tests", () => {
    describe("GET /authentication/login", () => {
        it("should successfully log in as a student", async () => {
            const res: Response = await request(index)
                .post("/authentication/login")
                .send({
                    email: student.email,
                    password: student.password
                });

            expect(res.status).toBe(200);
            expect(z.object({
                token: z.string(),
                user: z.literal(userLink(student.id))
            }).safeParse(res.body).success).toBe(true);
        });

        it("should successfully log in as a teacher", async () => {
            const res: Response = await request(index)
                .post("/authentication/login")
                .send({
                    email: teacher.email,
                    password: teacher.password
                });

            expect(res.status).toBe(200);
            expect(z.object({
                token: z.string(),
                user: z.literal(userLink(teacher.id))
            }).safeParse(res.body).success).toBe(true);
        });

        it("should successfully log in as a student without email", async () => {
            const res: Response = await request(index)
                .post("/authentication/login")
                .send({ password: teacher.password });

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: "invalid email" });
        });

        it("should successfully log in as a teacher without email", async () => {
            const res: Response = await request(index)
                .post("/authentication/login")
                .send({ password: teacher.password });

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: "invalid email" });
        });

        it("should successfully log in as a student without password", async () => {
            const res: Response = await request(index)
                .post("/authentication/login")
                .send({ email: student.email });

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: "invalid password" });
        });

        it("should successfully log in as a teacher without password", async () => {
            const res: Response = await request(index)
                .post("/authentication/login")
                .send({ email: teacher.email });

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: "invalid password" });
        });

        it("should fail to log in with a non-existent student", async () => {
            const res: Response = await request(index)
                .post("/authentication/login")
                .send({
                    email: "nonexistent.student@ugent.be",
                    password: "randompassword"
                });

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: "user not found" });
        });

        it("should fail to log in with incorrect student password", async () => {
            const res: Response = await request(index)
                .post("/authentication/login")
                .send({
                    email: student.email,
                    password: "wrongpassword"
                });

            expect(res.status).toBe(401);
            expect(res.body).toEqual({ error: "wrong password" });
        });

        it("should fail to log in with wrong teacher password", async () => {
            const res: Response = await request(index)
                .post("/authentication/login")
                .send({
                    email: teacher.email,
                    password: "wrongpassword"
                });

            expect(res.status).toBe(401);
            expect(res.body).toEqual({ error: "wrong password" });
        });

        it("should fail to log in with wrong student password", async () => {
            const res: Response = await request(index)
                .post("/authentication/login")
                .send({
                    email: student.email,
                    password: "wrongpassword"
                });

            expect(res.status).toBe(401);
            expect(res.body).toEqual({ error: "wrong password" });
        });

        it("should fail to log in with invalid wrong student email", async () => {
            const res: Response = await request(index)
                .post("/authentication/login")
                .send({
                    email: "wrong@ugent.be",
                    password: student.password
                });

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: "user not found" });
        });

        it("should fail to log in with invalid wrong teacher email", async () => {
            const res: Response = await request(index)
                .post("/authentication/login")
                .send({
                    email: "wrong@ugent.Be",
                    password: teacher.password
                });

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: "user not found" });
        });

    });
});
