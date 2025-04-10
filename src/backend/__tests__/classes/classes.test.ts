import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import index from "../../index.ts";

let teacherToken: string;
let teacherId: string;
let classId: string;

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
    teacherId = loginRes.body.user.replace('/teachers/', '');
    teacherToken = loginRes.body.token;
}

beforeAll(async () => {
    // Register a new teacher for the tests
    await registerTeacher();
});

describe.skip("Class Management", () => {
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
        classId = res.body.id;
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
