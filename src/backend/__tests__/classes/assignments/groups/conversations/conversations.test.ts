import request from "supertest";
import {beforeAll, describe, expect, it, vi} from "vitest";
import index from '../../../../../index.ts';

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


// GET /classes/:classId/assignments/:assignmentId/groups/:groupId/conversations
describe("groepConversaties", () => {
    it("moet een lijst van conversations teruggeven met statuscode 200", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;
        const groupId: number = 1;

        // verstuur het GET request
        const response = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/groepen/${groupId}/conversations`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(200);
        expect(response.body.conversations).toHaveLength(2);
        expect(response.body).toEqual({
            conversations: [
                `/classes/${classId}/assignments/${assignmentId}/groepen/${groupId}/conversations/1`,
                `/classes/${classId}/assignments/${assignmentId}/groepen/${groupId}/conversations/2`,
            ]
        });
    });


    it("moet een lege lijst teruggeven als er geen conversations voor de opdracht zijn", async () => {
        const classId: number = 1;
        const groupId: number = 3;
        const assignmentId: number = 3;

        // verstuur het GET request
        const response = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/groepen/${groupId}/conversations`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(200);
        expect(response.body.conversations).toHaveLength(0);
        expect(response.body).toEqual({
            conversations: []
        });
    });

    it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
        const assignmentId: number = 1;
        const groupId: number = 1;

        // verstuur het GET request
        const response = await request(index)
            .get(`/classes/abc/assignments/${assignmentId}/groepen/${groupId}/conversations`)
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
            .get(`/classes/${classId}/assignments/abc/groepen/${groupId}/conversations`)
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
            .get(`/classes/${classId}/assignments/${assignmentId}/groepen/abc/conversations`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid groupId"});
    });
});

// POST /classes/:classId/assignments/:assignmentId/groups/:groupId/conversations
describe("groepMaakConversatie", () => {
    it("moet een de nieuwe conversatie teruggeven met statuscode 200", async () => {
        const classId: number = 1;
        const assignmentId: number = 3;
        const groupId: number = 3;
        const conversationId: number = 4;
        const body = {titel: "Test conversation", learningobject: "/learningobjects/550e8400-e29b-41d4-a716-446655440002"}; // todo: heel de url ingeven

        // verstuur het POST request
        const response = await request(index)
            .post(`/classes/${classId}/assignments/${assignmentId}/groepen/${groupId}/conversations`).send(body)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            conversatie: `/classes/${classId}/assignments/${assignmentId}/groepen/${groupId}/conversations/${conversationId}`
        });
    });

    it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
        const assignmentId: number = 3;
        const groupId: number = 1;
        const body = {titel: "Test conversation", learningobject: "/learningobjects/550e8400-e29b-41d4-a716-446655440002"}; // todo: heel de url ingeven

        // verstuur het POST request
        const response = await request(index)
            .post(`/classes/abc/assignments/${assignmentId}/groepen/${groupId}/conversations`).send(body)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid classId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig assignmentId", async () => {
        const classId: number = 1;
        const groupId: number = 1;
        const body = {titel: "Test conversation", learningobject: "/learningobjects/550e8400-e29b-41d4-a716-446655440002"}; // todo: heel de url ingeven

        // verstuur het POST request
        const response = await request(index)
            .post(`/classes/${classId}/assignments/abc/groepen/${groupId}/conversations`).send(body)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid assignmentId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig groupId", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;
        const body = {titel: "Test conversation", learningobject: "/learningobjects/550e8400-e29b-41d4-a716-446655440002"}; // todo: heel de url ingeven

        // verstuur het POST request
        const response = await request(index)
            .post(`/classes/${classId}/assignments/${assignmentId}/groepen/abc/conversations`).send(body)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid groupId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig learningobject url in de body", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;
        const groupId: number = 1;
        const body = {titel: "Test conversation", learningobject: "/foute-url/550e8400-e29b-41d4-a716-446655440002"}; // todo: heel de url ingeven

        // verstuur het POST request
        const response = await request(index)
            .post(`/classes/${classId}/assignments/${assignmentId}/groepen/${groupId}/conversations`).send(body)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "wrong body"});
    });
});

// GET /classes/:classId/assignments/:assignmentId/groups/:groupId/conversations/:conversationId
describe("conversatie", () => {
    it("moet een conversatie teruggeven met statuscode 200", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;
        const groupId: number = 1;
        const conversationId: number = 1;
        const conversationTitle: string = "Group 1 conversation";

        // verstuur het GET request
        const response = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/groepen/${groupId}/conversations/${conversationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            title: conversationTitle,
            groep: groupId,
            berichten: `/classes/${classId}/assignments/${assignmentId}/groepen/${groupId}/conversations/${conversationId}/berichten`
        });
    });

    it("moet statuscode 404 terug geven als de conversatie niet gevonden wordt", async () => {
        const classId: number = 1;
        const groupId: number = 1;
        const assignmentId: number = 1;
        const conversationId: number = 234;

        // verstuur het GET request
        const response = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/groepen/${groupId}/conversations/${conversationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            error: `conversation not found`
        });
    });

    it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
        const assignmentId: number = 1;
        const groupId: number = 1;
        const conversationId: number = 1;

        // verstuur het GET request
        const response = await request(index)
            .get(`/classes/abc/assignments/${assignmentId}/groepen/${groupId}/conversations/${conversationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid classId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig assignmentId", async () => {
        const classId: number = 1;
        const groupId: number = 1;
        const conversationId: number = 1;

        // verstuur het GET request
        const response = await request(index)
            .get(`/classes/${classId}/assignments/abc/groepen/${groupId}/conversations/${conversationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid assignmentId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig groupId", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;
        const conversationId: number = 1;

        // verstuur het GET request
        const response = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/groepen/abc/conversations/${conversationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid groupId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig conversationId", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;
        const groupId: number = 1;

        // verstuur het GET request
        const response = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/groepen/${groupId}/conversations/abc`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid conversationId"});
    });
});

// DELETE /classes/:classId/assignments/:assignmentId/groups/:groupId/conversations/:conversationId
describe("verwijderConversatie", () => {
    it("moet statuscode 200 teruggeven wanneer verwijderen lukt", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;
        const groupId: number = 1;
        const conversationId: number = 1;

        // verstuur het DELETE request
        const response = await request(index)
            .delete(`/classes/${classId}/assignments/${assignmentId}/groepen/${groupId}/conversations/${conversationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(200);
    });

    it("moet statuscode 404 terug geven als de conversatie niet gevonden wordt", async () => {
        const classId: number = 1;
        const groupId: number = 1;
        const assignmentId: number = 1;
        const conversationId: number = 6;

        // verstuur het DELETE request
        const response = await request(index)
            .delete(`/classes/${classId}/assignments/${assignmentId}/groepen/${groupId}/conversations/${conversationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            error: `conversation not found`
        });
    });

    it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
        const assignmentId: number = 1;
        const groupId: number = 1;
        const conversationId: number = 1;

        // verstuur het DELETE request
        const response = await request(index)
            .delete(`/classes/abc/assignments/${assignmentId}/groepen/${groupId}/conversations/${conversationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid classId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig assignmentId", async () => {
        const classId: number = 1;
        const groupId: number = 1;
        const conversationId: number = 1;

        // verstuur het DELETE request
        const response = await request(index)
            .delete(`/classes/${classId}/assignments/abc/groepen/${groupId}/conversations/${conversationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid assignmentId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig groupId", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;
        const conversationId: number = 1;

        // verstuur het DELETE request
        const response = await request(index)
            .delete(`/classes/${classId}/assignments/${assignmentId}/groepen/abc/conversations/${conversationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid groupId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig conversationId", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;
        const groupId: number = 1;

        // verstuur het DELETE request
        const response = await request(index)
            .delete(`/classes/${classId}/assignments/${assignmentId}/groepen/${groupId}/conversations/abc`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid conversationId"});
    });
});
