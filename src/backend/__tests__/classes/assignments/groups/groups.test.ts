import request from "supertest";
import {beforeAll, describe, expect, it, vi} from "vitest";
import index from '../../../../index.ts';

vi.mock("../prismaClient", () => ({
    classStudent: {
        findMany: vi.fn(),
    },
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


// GET classes/:classId/assignments/:assignmentId/groups
describe("opdrachtGroepen", () => {
    it("moet een lijst van groups teruggeven met statuscode 200", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;

        // verstuur het GET request
        const response = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/groepen`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(200);
        expect(response.body.groepen).toHaveLength(1);
        expect(response.body).toEqual({
            groepen: [
                `/classes/${classId}/assignments/${assignmentId}/groepen/1`,
            ]
        });
    });

    it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
        const assignmentId: number = 1;

        // verstuur het GET request
        const response = await request(index)
            .get(`/classes/abc/assignments/${assignmentId}/groepen`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid classId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig assignmentId", async () => {
        const classId: number = 1;

        // verstuur het GET request
        const response = await request(index)
            .get(`/classes/${classId}/assignments/abc/groepen`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid assignmentId"});
    });
});

// POST /classes/:classId/assignments/:assignmentId/groups
describe("opdrachtMaakGroep", () => {
    it("moet een de nieuwe groep teruggeven met statuscode 200", async () => {
        const classId: number = 1;
        const assignmentId: number = 3;
        const body = {students: ["/students/1", "/students/2"]};

        // verstuur het POST request
        const response = await request(index)
            .post(`/classes/${classId}/assignments/${assignmentId}/groepen`).send(body)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(200);
    });

    it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
        const assignmentId: number = 3;
        const body = {students: ["/students/1", "/students/2"]};

        // verstuur het POST request
        const response = await request(index)
            .post(`/classes/abc/assignments/${assignmentId}/groepen`).send(body)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid classId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig assignmentId", async () => {
        const classId: number = 1;
        const body = {students: ["/students/1", "/students/2"]};

        // verstuur het POST request
        const response = await request(index)
            .post(`/classes/${classId}/assignments/abc/groepen`).send(body)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid assignmentId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldige body", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;
        const body = {students: ["/fout/1", "/students/xc"]};

        // verstuur het POST request
        const response = await request(index)
            .post(`/classes/${classId}/assignments/${assignmentId}/groepen`).send(body)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "wrong body"});
    });
});


// DELETE classes/:classId/assignments/:assignmentId/groups/:groupId
describe("opdrachtVerwijderGroep", () => {
    it("moet statuscode 200 teruggeven wanneer verwijderen lukt", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;
        const groupId: number = 1;

        // verstuur het GET request
        const response = await request(index)
            .delete(`/classes/${classId}/assignments/${assignmentId}/groepen/${groupId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(200);
    });

    it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
        const assignmentId: number = 1;
        const groupId: number = 1;

        // verstuur het GET request
        const response = await request(index)
            .delete(`/classes/abc/assignments/${assignmentId}/groepen/${groupId}`)
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
            .delete(`/classes/${classId}/assignments/abc/groepen/${groupId}`)
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
            .delete(`/classes/${classId}/assignments/${assignmentId}/groepen/abc`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid groupId"});
    });
});