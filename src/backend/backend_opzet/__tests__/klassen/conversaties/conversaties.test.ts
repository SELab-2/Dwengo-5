import request from "supertest";
import { describe, expect, it, vi, beforeAll } from "vitest";
import index, {website_base} from "../../../index.ts";

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

// GET /klassen/{klas_id}/conversaties
describe("opdrachtConversaties", () => {
    it("moet een lijst van conversaties teruggeven met statuscode 200", async () => {
        const classId: number = 1;

        // verstuur het GET request
        const response = await request(index)
            .get(`/klassen/${classId}/conversaties`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        
        // controlleer de response
        expect(response.status).toBe(200);
        expect(response.body.conversaties).toHaveLength(2);
        expect(response.body).toEqual({
            conversaties: [
                `/klassen/${classId}/opdrachten/1/groepen/1/conversaties/1`,
                `/klassen/${classId}/opdrachten/1/groepen/1/conversaties/2`,
            ]
        });
    }); 
    
    it("moet een lege lijst teruggeven als er geen conversaties voor de opdracht zijn", async () => {
        const classId: number = 3;

        // verstuur het GET request
        const response = await request(index)
            .get(`/klassen/${classId}/conversaties`)
            .set("Authorization", `Bearer ${authToken}`);
        
        // controlleer de response
        expect(response.status).toBe(200);
        expect(response.body.conversaties).toHaveLength(0);
        expect(response.body).toEqual({
            conversaties: []
        });
    });
    
    it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
        // verstuur het GET request
        const response = await request(index)
            .get(`/klassen/abc/conversaties`)
            .set("Authorization", `Bearer ${authToken}`);
        
        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid classId"});
    });

    // todo
    /*
    it("moet statuscode 500 teruggeven bij een interne fout", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;

        // todo: simuleer een interne fout door de prisma methode te mocken
        vi.spyOn(prisma.conversation, 'findMany').mockRejectedValueOnce(new Error('Internal Error'));

        // verstuur het GET request
        const response = await request(index)
            .get(`/klassen/${classId}/conversaties`)
            .set("Authorization", `Bearer ${authToken}`);
        
        // controlleer de response
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "internal error" });
    });*/
});
