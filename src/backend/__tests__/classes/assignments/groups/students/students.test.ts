import request from "supertest";
import {beforeAll, describe, expect, it, vi} from "vitest";
import index from '../../../../../index.ts';

vi.mock("../prismaClient", () => ({
    classStudent: {
        findMany: vi.fn()
    }
}));

let authToken: string;

beforeAll(async () => {
    // Perform login as teacher1
    const loginPayload = {
        email: "teacher1@example.com",
        password: "test",
    };

    const response = await request(index).post("/authentication/login?usertype=teacher").send(loginPayload);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");

    authToken = response.body.token;
});

// GET /classes/:classId/assignments/:assignmentId/groups/:groupId/students
describe("groepLeerlingen", () => {
    it("moet een lijst van students teruggeven met statuscode 200", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;
        const groupId: number = 1;

        // verstuur het GET request
        const response = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/groepen/${groupId}/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(200);
        expect(response.body.students).toHaveLength(1);
        expect(response.body.students).toEqual([
            "/students/1",
        ]);
    });

    it("moet statuscode 404 terug geven als de groep voor deze opdracht & klas niet bestaat", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;
        const groupId: number = 123;

        // verstuur het GET request
        const response = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/groepen/${groupId}/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(404);
        expect(response.body).toEqual({"error": "group not found"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
        const assignmentId: number = 1;
        const groupId: number = 1;

        // verstuur het GET request
        const response = await request(index)
            .get(`/classes/abc/assignments/${assignmentId}/groepen/${groupId}/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid classId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig assignmentId", async () => {
        const classId: number = 1;
        const groupId: number = 1;

        // verstuur het GET request
        const response = await request(index)
            .get(`/classes/${classId}/assignments/abc/groepen/${groupId}/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid assignmentId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig groupId", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;

        // verstuur het GET request
        const response = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/groepen/abc/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid groupId"});
    });
});


// POST /classes/:classId/assignments/:assignmentId/groups/:groupId/students
describe("groepVoegLeerlingToe", () => {
    it("moet statuscode 200 teruggeven als het toevoegen van de student lukt", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;
        const groupId: number = 1;
        const body = {student: "/students/2"};

        // verstuur het POST request
        const response = await request(index)
            .post(`/classes/${classId}/assignments/${assignmentId}/groepen/${groupId}/students`)
            .send(body)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(200);
    });

    it("moet statuscode 404 terug geven als de groep voor deze opdracht & klas niet bestaat", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;
        const groupId: number = 123;
        const body = {student: "/students/1"};

        // verstuur het POST request
        const response = await request(index)
            .post(`/classes/${classId}/assignments/${assignmentId}/groepen/${groupId}/students`)
            .send(body)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(404);
        expect(response.body).toEqual({"error": "group not found"});
    });

    it("moet statuscode 404 terug geven als de student niet bestaat", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;
        const groupId: number = 1;
        const body = {student: "/students/3"};

        // verstuur het POST request
        const response = await request(index)
            .post(`/classes/${classId}/assignments/${assignmentId}/groepen/${groupId}/students`)
            .send(body)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(404);
        expect(response.body).toEqual({"error": "student not found"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
        const assignmentId: number = 1;
        const groupId: number = 1;
        const body = {student: "/students/1"};

        // verstuur het POST request
        const response = await request(index)
            .post(`/classes/abc/assignments/${assignmentId}/groepen/${groupId}/students`)
            .send(body)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid classId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig assignmentId", async () => {
        const classId: number = 1;
        const groupId: number = 1;
        const body = {student: "/students/1"};

        // verstuur het POST request
        const response = await request(index)
            .post(`/classes/${classId}/assignments/abc/groepen/${groupId}/students`)
            .send(body)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid assignmentId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig groupId", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;
        const body = {student: "/students/1"};

        // verstuur het POST request
        const response = await request(index)
            .post(`/classes/${classId}/assignments/${assignmentId}/groepen/abc/students`)
            .send(body)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid groupId"});
    });
});


// DELETE /classes/:classId/assignments/:assignmentId/groups/:groupId/students/:studentId
describe("groepVerwijderLeerling", () => {
    it("moet statuscode 200 teruggeven wanneer verwijderen lukt", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;
        const groupId: number = 1;
        const studentId: number = 1;

        // verstuur het GET request
        const response = await request(index)
            .delete(`/classes/${classId}/assignments/${assignmentId}/groepen/${groupId}/students/${studentId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(200);
    });

    it("moet statuscode 404 terug geven als de groep voor deze opdracht & klas niet bestaat", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;
        const groupId: number = 123;
        const studentId: number = 1;

        // verstuur het GET request
        const response = await request(index)
            .delete(`/classes/${classId}/assignments/${assignmentId}/groepen/${groupId}/students/${studentId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(404);
        expect(response.body).toEqual({"error": "group not found"});
    });

    it("moet statuscode 404 terug geven als de student niet bestaat", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;
        const groupId: number = 1;
        const studentId: number = 123;

        // verstuur het GET request
        const response = await request(index)
            .delete(`/classes/${classId}/assignments/${assignmentId}/groepen/${groupId}/students/${studentId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(404);
        expect(response.body).toEqual({"error": "student not found"});
    });

    it("moet statuscode 404 terug geven als de student niet in de groep zit", async () => {
        const classId: number = 1;
        const assignmentId: number = 3;
        const groupId: number = 3;
        const studentId: number = 2;


        // verstuur het GET request
        const response = await request(index)
            .delete(`/classes/${classId}/assignments/${assignmentId}/groepen/${groupId}/students/${studentId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(404);
        expect(response.body).toEqual({"error": "student not in group"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
        const assignmentId: number = 1;
        const groupId: number = 1;
        const studentId: number = 1;

        // verstuur het GET request
        const response = await request(index)
            .delete(`/classes/abc/assignments/${assignmentId}/groepen/${groupId}/students/${studentId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid classId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig assignmentId", async () => {
        const classId: number = 1;
        const groupId: number = 1;
        const studentId: number = 1;

        // verstuur het GET request
        const response = await request(index)
            .delete(`/classes/${classId}/assignments/abc/groepen/${groupId}/students/${studentId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid assignmentId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig groupId", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;
        const studentId: number = 1;

        // verstuur het GET request
        const response = await request(index)
            .delete(`/classes/${classId}/assignments/${assignmentId}/groepen/abc/students/${studentId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid groupId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig studentId", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;
        const groupId: number = 1;

        // verstuur het GET request
        const response = await request(index)
            .delete(`/classes/${classId}/assignments/${assignmentId}/groepen/${groupId}/students/abc`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid studentId"});
    });
});
