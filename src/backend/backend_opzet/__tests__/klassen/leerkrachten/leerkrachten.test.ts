import request from "supertest";
import { describe, expect, it, vi, beforeAll } from "vitest";
import index, { website_base } from '../../../index.ts';
import seedDatabase from '../../../prisma/seedDatabase.ts';

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


// GET /klassen/:klas_id/leerkrachten
describe("klasLeerlingen", () => {
    it("moet een lijst van leerkrachten teruggeven met statuscode 200", async () => {
        const classId: number = 1;

        // verstuur het GET request
        const response = await request(index)
            .get(`/klassen/${classId}/leerkrachten`)
            .set("Authorization", `Bearer ${authToken.trim()}`); 


        // controlleer de response
        expect(response.status).toBe(200);
        expect(response.body.leerkrachten).toHaveLength(2);
        expect(response.body).toEqual({
            leerkrachten: [
                `/leerkrachten/1`,
                `/leerkrachten/2`,
            ]   
        });
    });
    
    it("moet statuscode 404 terug geven als de klas niet gevonden wordt", async () => {
        const classId: number = 123;
        
        // verstuur het GET request
        const response = await request(index)
            .get(`/klassen/${classId}/leerkrachten`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        
        // controlleer de response
        expect(response.status).toBe(404);
        expect(response.body).toEqual({"error": "class not found"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
        // verstuur het GET request
        const response = await request(index)
            .get(`/klassen/abc/leerkrachten`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        
        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid classId"});
    });

});

// POST /klassen/{klas_id}/leerkrachtens
// todo: implementeer na implementatie van voegLeerkrachtToe
/*
describe("voegLeerkrachtToe", () => {
});
*/

// DELETE /klassen/:klas_id/leerkrachten/:leerkracht_id
describe("klasVerwijderLeerkracht", () => {
    it("moet statuscode 200 teruggeven als leerkracht werd verwijderd uit de klas", async () => {
        const classId: number = 1;
        const teacherId: number = 1;

        // verstuur het DELETE request
        const response = await request(index)
            .delete(`/klassen/${classId}/leerkrachten/${teacherId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        
        // controlleer de response
        expect(response.status).toBe(200);
    });

    it("moet statuscode 404 terug geven als de klas niet gevonden wordt", async () => {
        const classId: number = 123;
        const teacherId: number = 1;

        // verstuur het GET request
        const response = await request(index)
            .delete(`/klassen/${classId}/leerkrachten/${teacherId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        
        // controlleer de response
        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            error: `class not found`
        });
    });

    it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
        const teacherId: number = 1;

        // verstuur het GET request
        const response = await request(index)
            .delete(`/klassen/abc/leerkrachten/${teacherId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        
        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid classId"});
    });
    
    it("moet statuscode 400 terug geven bij een ongeldig teacherId", async () => {
        const classId: number = 1;

        // verstuur het GET request
        const response = await request(index)
            .delete(`/klassen/${classId}/leerkrachten/abc`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        
        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid teacherId"});
    });
});
