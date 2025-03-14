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

    const response = await request(index).post("/authenticatie/aanmelden?gebruikerstype=leerkracht").send(loginPayload);

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
            .get(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/${groupId}/leerlingen`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(200);
        expect(response.body.leerlingen).toHaveLength(1);
        expect(response.body.leerlingen).toEqual([
            "/students/1",
        ]);
    });

    it("moet statuscode 404 terug geven als de groep voor deze opdracht & klas niet bestaat", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;
        const groupId: number = 123;

        // verstuur het GET request
        const response = await request(index)
            .get(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/${groupId}/leerlingen`)
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
            .get(`/klassen/abc/opdrachten/${assignmentId}/groepen/${groupId}/leerlingen`)
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
            .get(`/klassen/${classId}/opdrachten/abc/groepen/${groupId}/leerlingen`)
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
            .get(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/abc/leerlingen`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid groupId"});
    });
});


// POST /classes/:classId/assignments/:assignmentId/groups/:groupId/students
describe("groepVoegLeerlingToe", () => {
    it("moet statuscode 200 teruggeven als het toevoegen van de leerling lukt", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;
        const groupId: number = 1;
        const body = {leerling: "/students/2"};

        // verstuur het POST request
        const response = await request(index)
            .post(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/${groupId}/leerlingen`)
            .send(body)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(200);
    });

    it("moet statuscode 404 terug geven als de groep voor deze opdracht & klas niet bestaat", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;
        const groupId: number = 123;
        const body = {leerling: "/students/1"};

        // verstuur het POST request
        const response = await request(index)
            .post(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/${groupId}/leerlingen`)
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
        const body = {leerling: "/students/3"};

        // verstuur het POST request
        const response = await request(index)
            .post(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/${groupId}/leerlingen`)
            .send(body)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(404);
        expect(response.body).toEqual({"error": "student not found"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
        const assignmentId: number = 1;
        const groupId: number = 1;
        const body = {leerling: "/students/1"};

        // verstuur het POST request
        const response = await request(index)
            .post(`/klassen/abc/opdrachten/${assignmentId}/groepen/${groupId}/leerlingen`)
            .send(body)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid classId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig assignmentId", async () => {
        const classId: number = 1;
        const groupId: number = 1;
        const body = {leerling: "/students/1"};

        // verstuur het POST request
        const response = await request(index)
            .post(`/klassen/${classId}/opdrachten/abc/groepen/${groupId}/leerlingen`)
            .send(body)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid assignmentId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig groupId", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;
        const body = {leerling: "/students/1"};

        // verstuur het POST request
        const response = await request(index)
            .post(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/abc/leerlingen`)
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
            .delete(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/${groupId}/leerlingen/${studentId}`)
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
            .delete(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/${groupId}/leerlingen/${studentId}`)
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
            .delete(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/${groupId}/leerlingen/${studentId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(404);
        expect(response.body).toEqual({"error": "student not found"});
    });

    it("moet statuscode 404 terug geven als de leerling niet in de groep zit", async () => {
        const classId: number = 1;
        const assignmentId: number = 3;
        const groupId: number = 3;
        const studentId: number = 2;


        // verstuur het GET request
        const response = await request(index)
            .delete(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/${groupId}/leerlingen/${studentId}`)
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
            .delete(`/klassen/abc/opdrachten/${assignmentId}/groepen/${groupId}/leerlingen/${studentId}`)
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
            .delete(`/klassen/${classId}/opdrachten/abc/groepen/${groupId}/leerlingen/${studentId}`)
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
            .delete(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/abc/leerlingen/${studentId}`)
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
            .delete(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/${groupId}/leerlingen/abc`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid studentId"});
    });
});
