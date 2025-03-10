import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import index from '../../../../../index.ts';
import {PrismaClient} from "@prisma/client";
import { title } from "process";
const prisma = new PrismaClient();

vi.mock("../prismaClient", () => ({
    classStudent: {
        findMany: vi.fn()
    }
}));


// GET /klassen/{klas_id}/opdrachten/{opdracht_id}/groepen/{groep_id}/conversaties
describe("groepConversaties", () => {
    it("moet een lijst van conversaties teruggeven met statuscode 200", async () => {
        const classId: number = 123;
        const assignmentId: number = 123;
        const groupId: number = 123;
        const conversationId: number = 123; 

        // verstuur het GET request
        const response = await request(index).get(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/${groupId}/conversaties`);
        
        // controlleer de response
        expect(response.status).toBe(200);
        expect(response.body.conversaties).toHaveLength(1);
        expect(response.body).toEqual({
            leerlingen: [`/klassen/${classId}/opdrachten/${assignmentId}/groepen/${groupId}/conversaties/${conversationId}`]
        });
    });

    /*
    it("moet een lege lijst teruggeven als er geen conversaties voor de opdracht zijn", async () => {
        const classId: number = 234;
        const groupId: number = 234;
        const assignmentId: number = 234;

        // verstuur het GET request
        const response = await request(index).get(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/${groupId}/conversaties`);
        
        // controlleer de response
        expect(response.status).toBe(200);
        expect(response.body.leerlingen).toHaveLength(0);
        expect(response.body).toEqual({
            leerlingen: []
        });
    });

    it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
        const assignmentId: number = 123;
        const groupId: number = 123;

        // verstuur het GET request
        const response = await request(index).get(`/klassen/abc/opdrachten/${assignmentId}/groepen/${groupId}/conversaties`);
        
        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid classId"});
    });
    
    it("moet statuscode 400 terug geven bij een ongeldig assignmentId", async () => {
        const classId: number = 123;
        const groupId: number = 123;

        // verstuur het GET request
        const response = await request(index).get(`/klassen/${classId}/opdrachten/abc/groepen/${groupId}/conversaties`);
        
        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid classId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig groupId", async () => {
        const classId: number = 123;
        const assignmentId: number = 123;

        // verstuur het GET request
        const response = await request(index).get(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/abc/conversaties`);
        
        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid classId"});
    });

    it("moet statuscode 500 teruggeven bij een interne fout", async () => {
        const classId: number = 123;
        const assignmentId: number = 123;
        const groupId: number = 123;

        // simuleer een interne fout door de prisma methode te mocken
        vi.spyOn(prisma.classStudent, 'findMany').mockRejectedValueOnce(new Error('Internal Error'));

        // verstuur het GET request
        const response = await request(index).get(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/${groupId}/conversaties`);
        
        // controlleer de response
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "internal error" });
    });
});


// POST /klassen/{klas_id}/opdrachten/{opdracht_id}/groepen/{groep_id}/conversaties
describe("groepMaakConversatie", () => {
    it("moet een de nieuwe conversatie teruggeven met statuscode 200", async () => {
        const classId: number = 123;
        const assignmentId: number = 123;
        const groupId: number = 123;
        const conversationId: number = 123; 
        const body = {title: "TestTitle", leerobject: "testLeerobject"} // TODO

        // verstuur het POST request
        const response = await request(index).post(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/${groupId}/conversaties`).send(body);
        
        // controlleer de response
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            conversatie: `/klassen/${classId}/opdrachten/${assignmentId}/groepen/${groupId}/conversaties/${conversationId}`
        });
    });

    it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
        const assignmentId: number = 123;
        const groupId: number = 123;
        const body = {title: "TestTitle", leerobject: "testLeerobject"} // TODO

        // verstuur het POST request
        const response = await request(index).post(`/klassen/abc/opdrachten/${assignmentId}/groepen/${groupId}/conversaties`).send(body);
        
        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid classId"});
    });
    
    it("moet statuscode 400 terug geven bij een ongeldig assignmentId", async () => {
        const classId: number = 123;
        const groupId: number = 123;
        const body = {title: "TestTitle", leerobject: "testLeerobject"} // TODO

        // verstuur het POST request
        const response = await request(index).post(`/klassen/${classId}/opdrachten/abc/groepen/${groupId}/conversaties`).send(body);
        
        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid classId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig groupId", async () => {
        const classId: number = 123;
        const assignmentId: number = 123;
        const body = {title: "TestTitle", leerobject: "testLeerobject"} // TODO

        // verstuur het POST request
        const response = await request(index).post(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/abc/conversaties`).send(body);
        
        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid classId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig leerobject url in de body", async () => {
        const classId: number = 123;
        const assignmentId: number = 123;
        const groupId: number = 123;
        const body = {title: "TestTitle", leerobject: "testLeerobject"} // TODO

        // verstuur het POST request
        const response = await request(index).post(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/${groupId}/conversaties`).send(body);
        
        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid classId"});
    });

    it("moet statuscode 500 teruggeven bij een interne fout", async () => {
        const classId: number = 123;
        const assignmentId: number = 123;
        const groupId: number = 123;
        const body = {title: "TestTitle", leerobject: "testLeerobject"} // TODO
        
        // simuleer een interne fout door de prisma methode te mocken
        vi.spyOn(prisma.classStudent, 'create').mockRejectedValueOnce(new Error('Internal Error'));

        // verstuur het GET request
        const response = await request(index).post(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/${groupId}/conversaties`).send(body);
        
        // controlleer de response
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "internal error" });
    });
});


// GET /klassen/{klas_id}/opdrachten/{opdracht_id}/groepen/{groep_id}/conversaties/{conversatie_id}
describe("groepConversaties", () => {
    it("moet een onversatie teruggeven met statuscode 200", async () => {
        const classId: number = 123;
        const assignmentId: number = 123;
        const groupId: number = 123;
        const conversationId: number = 123; 
        const conversationTitle: string = "testTitel"; // TODO 

        // verstuur het GET request
        const response = await request(index).get(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/${groupId}/conversaties/${conversationId}`);
        
        // controlleer de response
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            title: conversationTitle,
            groep: groupId,
            berichten: `/klassen/${classId}/opdrachten/${assignmentId}/groepen/${groupId}/conversaties/${conversationId}/berichten`
        });
    });

    it("moet statuscode 404 terug geven als de conversatie niet gevonden wordt", async () => {
        const classId: number = 234;
        const groupId: number = 234;
        const assignmentId: number = 234;
        const conversationId: number = 234; 

        // verstuur het GET request
        const response = await request(index).get(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/${groupId}/conversaties/${conversationId}`);
        
        // controlleer de response
        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            error: `conversatie ${conversationId} niet gevonden`
        });
    });

    it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
        const assignmentId: number = 123;
        const groupId: number = 123;
        const conversationId: number = 123;

        // verstuur het GET request
        const response = await request(index).get(`/klassen/abc/opdrachten/${assignmentId}/groepen/${groupId}/conversaties/${conversationId}`);
        
        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid classId"});
    });
    
    it("moet statuscode 400 terug geven bij een ongeldig assignmentId", async () => {
        const classId: number = 123;
        const groupId: number = 123;
        const conversationId: number = 123;

        // verstuur het GET request
        const response = await request(index).get(`/klassen/${classId}/opdrachten/abc/groepen/${groupId}/conversaties/${conversationId}`);
        
        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid classId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig groupId", async () => {
        const classId: number = 123;
        const assignmentId: number = 123;
        const conversationId: number = 123;

        // verstuur het GET request
        const response = await request(index).get(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/abc/conversaties/${conversationId}`);
        
        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid classId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig conversationId", async () => {
        const classId: number = 123;
        const assignmentId: number = 123;
        const groupId: number = 123;

        // verstuur het GET request
        const response = await request(index).get(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/${groupId}/conversaties/abc`);
        
        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid classId"});
    });

    it("moet statuscode 500 teruggeven bij een interne fout", async () => {
        const classId: number = 123;
        const assignmentId: number = 123;
        const groupId: number = 123;
        const conversationId: number = 123;
        
        // simuleer een interne fout door de prisma methode te mocken
        vi.spyOn(prisma.classStudent, 'findUnique').mockRejectedValueOnce(new Error('Internal Error'));

        // verstuur het GET request
        const response = await request(index).get(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/${groupId}/conversaties/${conversationId}`);
        
        // controlleer de response
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "internal error" });
    });
});


// DELETE /klassen/{klas_id}/opdrachten/{opdracht_id}/groepen/{groep_id}/conversaties/{conversatie_id}
describe("verwijderConversatie", () => {
    it("moet statuscode 200 teruggeven wanneer verwijderen lukt", async () => {
        const classId: number = 123;
        const assignmentId: number = 123;
        const groupId: number = 123;
        const conversationId: number = 123; 

        // verstuur het DELETE request
        const response = await request(index).delete(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/${groupId}/conversaties/${conversationId}`);
        
        // controlleer de response
        expect(response.status).toBe(200);
    });

    it("moet statuscode 404 terug geven als de conversatie niet gevonden wordt", async () => {
        const classId: number = 234;
        const groupId: number = 234;
        const assignmentId: number = 234;
        const conversationId: number = 234; 

        // verstuur het DELETE request
        const response = await request(index).delete(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/${groupId}/conversaties/${conversationId}`);
        
        // controlleer de response
        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            error: `conversatie ${conversationId} niet gevonden`
        });
    });

    it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
        const assignmentId: number = 123;
        const groupId: number = 123;
        const conversationId: number = 123;

        // verstuur het DELETE request
        const response = await request(index).delete(`/klassen/abc/opdrachten/${assignmentId}/groepen/${groupId}/conversaties/${conversationId}`);
        
        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid classId"});
    });
    
    it("moet statuscode 400 terug geven bij een ongeldig assignmentId", async () => {
        const classId: number = 123;
        const groupId: number = 123;
        const conversationId: number = 123;

        // verstuur het DELETE request
        const response = await request(index).delete(`/klassen/${classId}/opdrachten/abc/groepen/${groupId}/conversaties/${conversationId}`);
        
        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid assignmentId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig groupId", async () => {
        const classId: number = 123;
        const assignmentId: number = 123;
        const conversationId: number = 123;

        // verstuur het DELETE request
        const response = await request(index).delete(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/abc/conversaties/${conversationId}`);
        
        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid groupId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig conversationId", async () => {
        const classId: number = 123;
        const assignmentId: number = 123;
        const groupId: number = 123;

        // verstuur het DELETE request
        const response = await request(index).delete(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/${groupId}/conversaties/abc`);
        
        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid conversationId"});
    });

    it("moet statuscode 500 teruggeven bij een interne fout", async () => {
        const classId: number = 123;
        const assignmentId: number = 123;
        const groupId: number = 123;
        const conversationId: number = 123;
        
        // simuleer een interne fout door de prisma methode te mocken
        vi.spyOn(prisma.classStudent, 'delete').mockRejectedValueOnce(new Error('Internal Error'));

        // verstuur het DELETE request
        const response = await request(index).delete(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/${groupId}/conversaties/${conversationId}`);
        
        // controlleer de response
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "internal error" });
    });
    */
});