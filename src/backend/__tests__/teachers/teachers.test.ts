import request from "supertest";
import {beforeAll, describe, expect, it} from "vitest";
import index from '../../index.ts';
import {z} from "zod";

let authToken: string;

const teacher1 = {
    name: "teacher_one",
    email: 'teacher1@example.com',
    password: 'test',
    id: 1
};

beforeAll(async () => {
    const response = await request(index)
        .post("/authentication/login?usertype=teacher")
        .send({
            email: teacher1.email,
            password: teacher1.password
        });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    authToken = response.body.token;
});


describe("teacher", () => {
    it("returns the name of the teacher", async () => {
        const res = await request(index)
            .get(`/teachers/${teacher1.id}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(200);
        expect(z.object({
            name: z.literal(teacher1.name)
        }).safeParse(res.body).success).toBe(true);
    });

    it("should fail on wrong teacherId", async () => {
        const res = await request(index)
            .get(`/teachers/abc`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
        expect(z.object({
            error: z.literal("invalid teacherId")
        }).safeParse(res.body).success).toBe(true);
    });
});


describe("delete student", () => {
    it("should return 200 on succesfull delete", async () => {
        const res = await request(index)
            .delete(`/teachers/${teacher1.id}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(200);
    });

    it("should fail on wrong teacher id", async () => {
        const res = await request(index)
            .delete(`/teachers/abc`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
        expect(z.object({
            error: z.literal("invalid teacherId")
        }).safeParse(res.body).success).toBe(true);
    });
});