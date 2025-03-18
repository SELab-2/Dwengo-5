import request from "supertest";
import { describe, expect, it, vi, beforeAll } from "vitest";
import index, { website_base } from '../../../../index.ts';
import seedDatabase from '../../../../prisma/seedDatabase.ts';

vi.mock("../prismaClient", () => ({
  classStudent: {
    findMany: vi.fn(),
  },
}));


let authToken: string;

beforeAll(async () => {
    await seedDatabase();
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


// GET klassen/:klas_id/opdrachten/:opdracht_id/groepen
describe("opdrachtGroepen", () => {
    it("moet een lijst van groepen teruggeven met statuscode 200", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;

        // verstuur het GET request
        const response = await request(index)
            .get(`/klassen/${classId}/opdrachten/${assignmentId}/groepen`)
            .set("Authorization", `Bearer ${authToken.trim()}`); 

        // controlleer de response
        expect(response.status).toBe(200);
        expect(response.body.groepen).toHaveLength(1);
        expect(response.body).toEqual({
            groepen: [
                `/klassen/${classId}/opdrachten/${assignmentId}/groepen/1`,
            ]   
        });
    });
    
    it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
        const assignmentId: number = 1;

        // verstuur het GET request
        const response = await request(index)
            .get(`/klassen/abc/opdrachten/${assignmentId}/groepen`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        
        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid classId"});
    });
    
    it("moet statuscode 400 terug geven bij een ongeldig assignmentId", async () => {
        const classId: number = 1;

        // verstuur het GET request
        const response = await request(index)
            .get(`/klassen/${classId}/opdrachten/abc/groepen`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        
        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid assignmentId"});
    });
});

// POST /klassen/:klas_id/opdrachten/:opdracht_id/groepen
describe("opdrachtMaakGroep", () => {
    it("moet een de nieuwe groep teruggeven met statuscode 200", async () => {
        const classId: number = 1;
        const assignmentId: number = 3;
        const body = {leerlingen: ["/leerlingen/1", "/leerlingen/2"]} 

        // verstuur het POST request
        const response = await request(index)
            .post(`/klassen/${classId}/opdrachten/${assignmentId}/groepen`).send(body)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        
        // controlleer de response
        expect(response.status).toBe(200);
    });
    
    it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
        const assignmentId: number = 3;
        const body = {leerlingen: ["/leerlingen/1", "/leerlingen/2"]} 

        // verstuur het POST request
        const response = await request(index)
        .post(`/klassen/abc/opdrachten/${assignmentId}/groepen`).send(body)
        .set("Authorization", `Bearer ${authToken.trim()}`);
        
        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid classId"});
    });
    
    it("moet statuscode 400 terug geven bij een ongeldig assignmentId", async () => {
        const classId: number = 1;
        const body = {leerlingen: ["/leerlingen/1", "/leerlingen/2"]} 

        // verstuur het POST request
        const response = await request(index)
            .post(`/klassen/${classId}/opdrachten/abc/groepen`).send(body)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        
        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid assignmentId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldige body", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;
        const body = {leerlingen: ["/fout/1", "/leerlingen/xc"]} 

        // verstuur het POST request
        const response = await request(index)
            .post(`/klassen/${classId}/opdrachten/${assignmentId}/groepen`).send(body)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        
        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "wrong body"});
    });
});


// DELETE klassen/:klas_id/opdrachten/:opdracht_id/groepen/:groep_id
describe("opdrachtVerwijderGroep", () => {
    it("moet statuscode 200 teruggeven wanneer verwijderen lukt", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;
        const groupId: number = 1;

        // verstuur het GET request
        const response = await request(index)
            .delete(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/${groupId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`); 

        // controlleer de response
        expect(response.status).toBe(200);
    });
    
    it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
        const assignmentId: number = 1;
        const groupId: number = 1;

        // verstuur het GET request
        const response = await request(index)
            .delete(`/klassen/abc/opdrachten/${assignmentId}/groepen/${groupId}`)
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
            .delete(`/klassen/${classId}/opdrachten/abc/groepen/${groupId}`)
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
            .delete(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/abc`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        
        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid groupId"});
    });
});