import request from "supertest";
import { describe, expect, it, vi, beforeAll } from "vitest";
import index, {website_base} from '../../../../../index.ts';

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

    const response = await request(index).post("/authenticatie/aanmelden?gebruikerstype=leerkracht").send(loginPayload);

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
            .get(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/${groupId}/conversaties`)
            .set("Authorization", `Bearer ${authToken.trim()}`); 

        // controlleer de response
        expect(response.status).toBe(200);
        expect(response.body.conversaties).toHaveLength(2);
        expect(response.body).toEqual({
            conversaties: [
                `/klassen/${classId}/opdrachten/${assignmentId}/groepen/${groupId}/conversaties/1`,
                `/klassen/${classId}/opdrachten/${assignmentId}/groepen/${groupId}/conversaties/2`,
            ]   
        });
    });

    
    it("moet een lege lijst teruggeven als er geen conversations voor de opdracht zijn", async () => {
        const classId: number = 1;
        const groupId: number = 3;
        const assignmentId: number = 3;

        // verstuur het GET request
        const response = await request(index)
            .get(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/${groupId}/conversaties`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        
        // controlleer de response
        expect(response.status).toBe(200);
        expect(response.body.conversaties).toHaveLength(0);
        expect(response.body).toEqual({
            conversaties: []
        });
    });
    
    it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
        const assignmentId: number = 1;
        const groupId: number = 1;

        // verstuur het GET request
        const response = await request(index)
            .get(`/klassen/abc/opdrachten/${assignmentId}/groepen/${groupId}/conversaties`)
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
            .get(`/klassen/${classId}/opdrachten/abc/groepen/${groupId}/conversaties`)
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
            .get(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/abc/conversaties`)
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
        const body = {titel: "Test conversation", leerobject: "/learningobjects/550e8400-e29b-41d4-a716-446655440002"} // todo: heel de url ingeven

        // verstuur het POST request
        const response = await request(index)
            .post(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/${groupId}/conversaties`).send(body)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        
        // controlleer de response
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            conversatie: `/klassen/${classId}/opdrachten/${assignmentId}/groepen/${groupId}/conversaties/${conversationId}`
        });
    });
    
    it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
        const assignmentId: number = 3;
        const groupId: number = 1;
        const body = {titel: "Test conversation", leerobject: "/learningobjects/550e8400-e29b-41d4-a716-446655440002"} // todo: heel de url ingeven

        // verstuur het POST request
        const response = await request(index)
        .post(`/klassen/abc/opdrachten/${assignmentId}/groepen/${groupId}/conversaties`).send(body)
        .set("Authorization", `Bearer ${authToken.trim()}`);
        
        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid classId"});
    });
    
    it("moet statuscode 400 terug geven bij een ongeldig assignmentId", async () => {
        const classId: number = 1;
        const groupId: number = 1;
        const body = {titel: "Test conversation", leerobject: "/learningobjects/550e8400-e29b-41d4-a716-446655440002"} // todo: heel de url ingeven

        // verstuur het POST request
        const response = await request(index)
            .post(`/klassen/${classId}/opdrachten/abc/groepen/${groupId}/conversaties`).send(body)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        
        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid assignmentId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig groupId", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;
        const body = {titel: "Test conversation", leerobject: "/learningobjects/550e8400-e29b-41d4-a716-446655440002"} // todo: heel de url ingeven

        // verstuur het POST request
        const response = await request(index)
            .post(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/abc/conversaties`).send(body)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        
        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid groupId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig leerobject url in de body", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;
        const groupId: number = 1;
        const body = {titel: "Test conversation", leerobject: "/foute-url/550e8400-e29b-41d4-a716-446655440002"} // todo: heel de url ingeven

        // verstuur het POST request
        const response = await request(index)
            .post(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/${groupId}/conversaties`).send(body)
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
            .get(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/${groupId}/conversaties/${conversationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        
        // controlleer de response
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            title: conversationTitle,
            groep: groupId,
            berichten: `/klassen/${classId}/opdrachten/${assignmentId}/groepen/${groupId}/conversaties/${conversationId}/berichten`
        });
    });

    it("moet statuscode 404 terug geven als de conversatie niet gevonden wordt", async () => {
        const classId: number = 1;
        const groupId: number = 1;
        const assignmentId: number = 1;
        const conversationId: number = 234; 

        // verstuur het GET request
        const response = await request(index)
            .get(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/${groupId}/conversaties/${conversationId}`)
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
            .get(`/klassen/abc/opdrachten/${assignmentId}/groepen/${groupId}/conversaties/${conversationId}`)
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
            .get(`/klassen/${classId}/opdrachten/abc/groepen/${groupId}/conversaties/${conversationId}`)
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
            .get(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/abc/conversaties/${conversationId}`)
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
            .get(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/${groupId}/conversaties/abc`)
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
            .delete(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/${groupId}/conversaties/${conversationId}`)
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
            .delete(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/${groupId}/conversaties/${conversationId}`)
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
            .delete(`/klassen/abc/opdrachten/${assignmentId}/groepen/${groupId}/conversaties/${conversationId}`)
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
            .delete(`/klassen/${classId}/opdrachten/abc/groepen/${groupId}/conversaties/${conversationId}`)
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
            .delete(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/abc/conversaties/${conversationId}`)
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
            .delete(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/${groupId}/conversaties/abc`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        
        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid conversationId"});
    });
});
