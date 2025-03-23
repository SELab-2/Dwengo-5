import request from "supertest";
import {beforeAll, describe, expect, it, vi} from "vitest";
import index from '../../../index.ts';
import {z} from "zod";
import {zTeacherLink} from "../../../help/validation.ts";

vi.mock("../prismaClient", () => ({
    classStudent: {
        findMany: vi.fn(),
    },
}));


let authToken: string;
const teacher = {
    email: "teacher1@example.com",
    password: "test",
    id: 1
};
const classroom = {
    id: 1
};

beforeAll(async () => {
    const res = await request(index)
        .post("/authentication/login?usertype=teacher")
        .send({
            email: teacher.email,
            password: teacher.password,
        });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");

    authToken = res.body.token;
});


describe("klasLeerlingen", () => {
    it("should return list of teachers", async () => {
        const res = await request(index)
            .get(`/classes/${classroom.id}/teachers`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(200);
        expect(z.object({
            teachers: z.array(zTeacherLink)
        }).safeParse(res.body).success).toBe(true);
        expect(res.body.teachers).toHaveLength(2);
        expect(res.body).toEqual({
            teachers: [
                `/teachers/1`,
                `/teachers/2`,
            ]
        });
    });

    it("fails if class is not found", async () => {
        const classId = 123456789;
        const res = await request(index)
            .get(`/classes/${classId}/teachers`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(403);
        expect(z.object({
            error: z.string().startsWith("class not found")
        }).safeParse(res.body).success).toBe(true);
    });

    it("fails on invalid classId", async () => {
        const classId = "abc";
        const res = await request(index)
            .get(`/classes/${classId}/teachers`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
        expect(z.object({
            error: z.literal("invalid classId")
        }).safeParse(res.body).success).toBe(true);
    });

});



describe("voegTeacherToe", () => {
    it("should return 200", async () => {
        const res = await request(index)
            .post(`/classes/${classroom.id}/teachers`)
            .send({
                teacher: "/teachers/3"
            })
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(200);
    });
});


describe("klasVerwijderTeacher", () => {
    it("deleting should return 200", async () => {
        const res = await request(index)
            .delete(`/classes/${classroom.id}/teachers/3`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(200);
    });

    it("404 if class not found", async () => {
        const classId: number = 123;
        const res = await request(index)
            .delete(`/classes/${classId}/teachers/${teacher.id}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(404);
        expect(z.object({
            error: z.literal("class not found")
        }).safeParse(res.body).success).toBe(true);
    });

    it("returns 400 on invalid classId", async () => {
        const res = await request(index)
            .delete(`/classes/abc/teachers/${teacher.id}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
        expect(z.object({
            error: z.literal("invalid classId")
        }).safeParse(res.body).success).toBe(true);
    });

    it("returns 400 on invalid teacherId", async () => {
        const res = await request(index)
            .delete(`/classes/${classroom.id}/teachers/abc`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
        expect(z.object({
            error: z.literal("invalid teacherId")
        }).safeParse(res.body).success).toBe(true);
    });
});
