import request from "supertest";
import {beforeAll, describe, expect, it, vi} from "vitest";
import index from '../../../../index.ts';

let authToken: string;
let wrongAuthToken: string;
const classId: number = 1;
const assignmentId: number = 1;
const invalidId = "INVALID_ID";
const randomId = 696969;

beforeAll(async () => {
    // Perform login as teacher1
    const loginPayload = {
        email: "teacher1@example.com",
        password: "test"
    };

    const loginPayloadStudent = {
        email: "student1@example.com",
        password: "test"
    };

    const resTeacher = await request(index).post("/authentication/login?usertype=teacher").send(loginPayload);
    expect(resTeacher.status).toBe(200);
    expect(resTeacher.body).toHaveProperty("token");
    authToken = resTeacher.body.token;

    const resStudent = await request(index).post("/authentication/login?usertype=student").send(loginPayloadStudent);
    expect(resStudent.status).toBe(200);
    expect(resStudent.body).toHaveProperty("token");
    wrongAuthToken = resStudent.body.token;

});


describe('GET all AssignmentConversations', () => {
    it ('GET all', async () => {
        const res = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/conversations`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('conversations');
    });

    it ('invalid classId', async () => {
        const res = await request(index)
            .get(`/classes/${invalidId}/assignments/${assignmentId}/conversations`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({"error": "invalid classId"});
    });

    it ('invalid assignmentId', async () => {
        const res = await request(index)
            .get(`/classes/${classId}/assignments/${invalidId}/conversations`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({"error": "invalid assignmentId"});
    });

    it ('assignment not found', async () => {
        const res = await request(index)
            .get(`/classes/${classId}/assignments/${randomId}/conversations`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(404);
        expect(res.body).toEqual({"error": "assignment not found"});
    });

    it ('no auth', async () => {
        const res = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/conversations`);

        expect(res.status).toBe(401);
    });

    it ('wrong auth', async () => {
        const res = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/conversations`)
            .set("Authorization", `Bearer ${wrongAuthToken.trim()}`);

        expect(res.status).toBe(403);
    });
});