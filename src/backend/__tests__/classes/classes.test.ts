import { beforeAll, afterAll,describe, expect, it } from "vitest";
import request from "supertest";
import index, {prisma} from "../../index.ts";
import {splitId} from "../../help/links.ts";

let teacherToken: string;
let teacherId: number;
let classId: number;

// Helper function to register a teacher
async function registerTeacher() {
    const newTeacher = {
        username: "test",
        password: "test",
        email: "test_classes_abjkhsxhdljksqdhsqkldh@example.com",
    };

    const res = await request(index).post("/authentication/register?usertype=teacher").send(newTeacher);
    expect(res.status).toBe(200);
    
    const loginRes = await request(index).post("/authentication/login?usertype=teacher").send(newTeacher);
    expect(loginRes.body).toHaveProperty("token");
    teacherId = splitId(loginRes.body.user);
    teacherToken = loginRes.body.token;
}

beforeAll(async () => {
    // Register a new teacher for the tests
    await registerTeacher();
});

describe("Class Management", () => {
  beforeAll(async () => {
    await prisma.$executeRaw`BEGIN`;
  });

  afterAll(async () => {
    await prisma.$executeRaw`ROLLBACK`;
  });
    it("should create a class", async () => {
        const newClass = {
            name: "test",
            teacher: `/teachers/${teacherId}`,
        };

        const res = await request(index)
            .post("/classes")
            .send(newClass)
            .set("Authorization", `Bearer ${teacherToken}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("classroom");
        classId = splitId(res.body.classroom);
    });

    it("should retrieve the created class", async () => {
        const res = await request(index)
            .get(`/classes/${classId}`)
            .set("Authorization", `Bearer ${teacherToken}`);

        expect(res.status).toBe(200);
    });

    it("should delete the class", async () => {
        const res = await request(index)
            .delete(`/classes/${classId}`)
            .set("Authorization", `Bearer ${teacherToken}`);
        
        expect(res.status).toBe(200);
    });
});
