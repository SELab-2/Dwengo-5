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
        const klasId: number = 123;
        const opdrachtId: number = 123;
        const groepId: number = 123;
        const conversatieId: number = 123; 

        // verstuur het GET request
        const response = await request(index).get(`/klassen/${klasId}/opdrachten/${opdrachtId}/groepen/${groepId}/conversaties`);
        
        // controlleer de response
        expect(response.status).toBe(200);
        expect(response.body.conversaties).toHaveLength(1);
        expect(response.body).toEqual({
            leerlingen: [`/klassen/${klasId}/opdrachten/${opdrachtId}/groepen/${groepId}/conversaties/${conversatieId}`]
        });
    });

    it("moet een lege lijst teruggeven als er geen conversaties voor de opdracht zijn", async () => {
        const klasId: number = 234;
        const groepId: number = 234;
        const opdrachtId: number = 234;

        // verstuur het GET request
        const response = await request(index).get(`/klassen/${klasId}/opdrachten/${opdrachtId}/groepen/${groepId}/conversaties`);
        
        // controlleer de response
        expect(response.status).toBe(200);
        expect(response.body.leerlingen).toHaveLength(0);
        expect(response.body).toEqual({
            leerlingen: []
        });
    });

    it("moet statuscode 400 terug geven bij een ongeldig klasId", async () => {
        const opdrachtId: number = 123;
        const groepId: number = 123;

        // verstuur het GET request
        const response = await request(index).get(`/klassen/abc/opdrachten/${opdrachtId}/groepen/${groepId}/conversaties`);
        
        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            "error": "fout geformateerde link",
            "details": [
                {
                    "validation": "regex",
                    "code": "invalid_string",
                    "message": "geen geldig klasId",
                    "path": [
                        "klas_id"
                    ]
                }
            ]
        });
    });
    
    it("moet statuscode 400 terug geven bij een ongeldig opdrachtId", async () => {
        const klasId: number = 123;
        const groepId: number = 123;

        // verstuur het GET request
        const response = await request(index).get(`/klassen/${klasId}/opdrachten/abc/groepen/${groepId}/conversaties`);
        
        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            "error": "fout geformateerde link",
            "details": [
                {
                    "validation": "regex",
                    "code": "invalid_string",
                    "message": "geen geldig opdrachtId",
                    "path": [
                        "opdracht_id"
                    ]
                }
            ]
        });
    });

    it("moet statuscode 400 terug geven bij een ongeldig groepId", async () => {
        const klasId: number = 123;
        const opdrachtId: number = 123;

        // verstuur het GET request
        const response = await request(index).get(`/klassen/${klasId}/opdrachten/${opdrachtId}/groepen/abc/conversaties`);
        
        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            "error": "fout geformateerde link",
            "details": [
                {
                    "validation": "regex",
                    "code": "invalid_string",
                    "message": "geen geldig groepId",
                    "path": [
                        "groep_id"
                    ]
                }
            ]
        });
    });

    it("moet statuscode 500 teruggeven bij een interne fout", async () => {
        const klasId: number = 123;
        const opdrachtId: number = 123;
        const groepId: number = 123;

        // simuleer een interne fout door de prisma methode te mocken
        vi.spyOn(prisma.classStudent, 'findMany').mockRejectedValueOnce(new Error('Internal Error'));

        // verstuur het GET request
        const response = await request(index).get(`/klassen/${klasId}/opdrachten/${opdrachtId}/groepen/${groepId}/conversaties`);
        
        // controlleer de response
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "interne fout" });
    });
});


// POST /klassen/{klas_id}/opdrachten/{opdracht_id}/groepen/{groep_id}/conversaties
describe("groepMaakConversatie", () => {
    it("moet een de nieuwe conversatie teruggeven met statuscode 200", async () => {
        const klasId: number = 123;
        const opdrachtId: number = 123;
        const groepId: number = 123;
        const conversatieId: number = 123; 
        const body = {title: "TestTitle", leerobject: "testLeerobject"} // TODO

        // verstuur het POST request
        const response = await request(index).post(`/klassen/${klasId}/opdrachten/${opdrachtId}/groepen/${groepId}/conversaties`).send(body);
        
        // controlleer de response
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            conversatie: `/klassen/${klasId}/opdrachten/${opdrachtId}/groepen/${groepId}/conversaties/${conversatieId}`
        });
    });

    it("moet statuscode 400 terug geven bij een ongeldig klasId", async () => {
        const opdrachtId: number = 123;
        const groepId: number = 123;
        const body = {title: "TestTitle", leerobject: "testLeerobject"} // TODO

        // verstuur het POST request
        const response = await request(index).post(`/klassen/abc/opdrachten/${opdrachtId}/groepen/${groepId}/conversaties`).send(body);
        
        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            "error": "fout geformateerde link",
            "details": [
                {
                    "validation": "regex",
                    "code": "invalid_string",
                    "message": "geen geldig klasId",
                    "path": [
                        "klas_id"
                    ]
                }
            ]
        });
    });
    
    it("moet statuscode 400 terug geven bij een ongeldig opdrachtId", async () => {
        const klasId: number = 123;
        const groepId: number = 123;
        const body = {title: "TestTitle", leerobject: "testLeerobject"} // TODO

        // verstuur het POST request
        const response = await request(index).post(`/klassen/${klasId}/opdrachten/abc/groepen/${groepId}/conversaties`).send(body);
        
        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            "error": "fout geformateerde link",
            "details": [
                {
                    "validation": "regex",
                    "code": "invalid_string",
                    "message": "geen geldig opdrachtId",
                    "path": [
                        "opdracht_id"
                    ]
                }
            ]
        });
    });

    it("moet statuscode 400 terug geven bij een ongeldig groepId", async () => {
        const klasId: number = 123;
        const opdrachtId: number = 123;
        const body = {title: "TestTitle", leerobject: "testLeerobject"} // TODO

        // verstuur het POST request
        const response = await request(index).post(`/klassen/${klasId}/opdrachten/${opdrachtId}/groepen/abc/conversaties`).send(body);
        
        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            "error": "fout geformateerde link",
            "details": [
                {
                    "validation": "regex",
                    "code": "invalid_string",
                    "message": "geen geldig groepId",
                    "path": [
                        "groep_id"
                    ]
                }
            ]
        });
    });

    it("moet statuscode 400 terug geven bij een ongeldig leerobject url in de body", async () => {
        const klasId: number = 123;
        const opdrachtId: number = 123;
        const groepId: number = 123;
        const body = {title: "TestTitle", leerobject: "testLeerobject"} // TODO

        // verstuur het POST request
        const response = await request(index).post(`/klassen/${klasId}/opdrachten/${opdrachtId}/groepen/${groepId}/conversaties`).send(body);
        
        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            "error": "fout geformateerde link",
            "details": [
                {
                    "validation": "regex",
                    "code": "invalid_string",
                    "message": "geen geldig groepId",
                    "path": [
                        "groep_id"
                    ]
                }
            ]
        });
    });

    it("moet statuscode 500 teruggeven bij een interne fout", async () => {
        const klasId: number = 123;
        const opdrachtId: number = 123;
        const groepId: number = 123;
        const body = {title: "TestTitle", leerobject: "testLeerobject"} // TODO
        
        // simuleer een interne fout door de prisma methode te mocken
        vi.spyOn(prisma.classStudent, 'create').mockRejectedValueOnce(new Error('Internal Error'));

        // verstuur het GET request
        const response = await request(index).post(`/klassen/${klasId}/opdrachten/${opdrachtId}/groepen/${groepId}/conversaties`).send(body);
        
        // controlleer de response
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "interne fout" });
    });
});


// GET /klassen/{klas_id}/opdrachten/{opdracht_id}/groepen/{groep_id}/conversaties/{conversatie_id}
describe("groepConversaties", () => {
    it("moet een onversatie teruggeven met statuscode 200", async () => {
        const klasId: number = 123;
        const opdrachtId: number = 123;
        const groepId: number = 123;
        const conversatieId: number = 123; 
        const conversatieTitel: string = "testTitel"; // TODO 

        // verstuur het GET request
        const response = await request(index).get(`/klassen/${klasId}/opdrachten/${opdrachtId}/groepen/${groepId}/conversaties/${conversatieId}`);
        
        // controlleer de response
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            title: conversatieTitel,
            groep: groepId,
            berichten: `/klassen/${klasId}/opdrachten/${opdrachtId}/groepen/${groepId}/conversaties/${conversatieId}/berichten`
        });
    });

    it("moet statuscode 404 terug geven als de conversatie niet gevonden wordt", async () => {
        const klasId: number = 234;
        const groepId: number = 234;
        const opdrachtId: number = 234;
        const conversatieId: number = 234; 

        // verstuur het GET request
        const response = await request(index).get(`/klassen/${klasId}/opdrachten/${opdrachtId}/groepen/${groepId}/conversaties/${conversatieId}`);
        
        // controlleer de response
        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            error: `conversatie ${conversatieId} niet gevonden`
        });
    });

    it("moet statuscode 400 terug geven bij een ongeldig klasId", async () => {
        const opdrachtId: number = 123;
        const groepId: number = 123;
        const conversatieId: number = 123;

        // verstuur het GET request
        const response = await request(index).get(`/klassen/abc/opdrachten/${opdrachtId}/groepen/${groepId}/conversaties/${conversatieId}`);
        
        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            "error": "fout geformateerde link",
            "details": [
                {
                    "validation": "regex",
                    "code": "invalid_string",
                    "message": "geen geldig klasId",
                    "path": [
                        "klas_id"
                    ]
                }
            ]
        });
    });
    
    it("moet statuscode 400 terug geven bij een ongeldig opdrachtId", async () => {
        const klasId: number = 123;
        const groepId: number = 123;
        const conversatieId: number = 123;

        // verstuur het GET request
        const response = await request(index).get(`/klassen/${klasId}/opdrachten/abc/groepen/${groepId}/conversaties/${conversatieId}`);
        
        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            "error": "fout geformateerde link",
            "details": [
                {
                    "validation": "regex",
                    "code": "invalid_string",
                    "message": "geen geldig opdrachtId",
                    "path": [
                        "opdracht_id"
                    ]
                }
            ]
        });
    });

    it("moet statuscode 400 terug geven bij een ongeldig groepId", async () => {
        const klasId: number = 123;
        const opdrachtId: number = 123;
        const conversatieId: number = 123;

        // verstuur het GET request
        const response = await request(index).get(`/klassen/${klasId}/opdrachten/${opdrachtId}/groepen/abc/conversaties/${conversatieId}`);
        
        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            "error": "fout geformateerde link",
            "details": [
                {
                    "validation": "regex",
                    "code": "invalid_string",
                    "message": "geen geldig groepId",
                    "path": [
                        "groep_id"
                    ]
                }
            ]
        });
    });

    it("moet statuscode 400 terug geven bij een ongeldig conversatieId", async () => {
        const klasId: number = 123;
        const opdrachtId: number = 123;
        const groepId: number = 123;

        // verstuur het GET request
        const response = await request(index).get(`/klassen/${klasId}/opdrachten/${opdrachtId}/groepen/${groepId}/conversaties/abc`);
        
        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            "error": "fout geformateerde link",
            "details": [
                {
                    "validation": "regex",
                    "code": "invalid_string",
                    "message": "geen geldig conversatieId",
                    "path": [
                        "conversatie_id"
                    ]
                }
            ]
        });
    });

    it("moet statuscode 500 teruggeven bij een interne fout", async () => {
        const klasId: number = 123;
        const opdrachtId: number = 123;
        const groepId: number = 123;
        const conversatieId: number = 123;
        
        // simuleer een interne fout door de prisma methode te mocken
        vi.spyOn(prisma.classStudent, 'findUnique').mockRejectedValueOnce(new Error('Internal Error'));

        // verstuur het GET request
        const response = await request(index).get(`/klassen/${klasId}/opdrachten/${opdrachtId}/groepen/${groepId}/conversaties/${conversatieId}`);
        
        // controlleer de response
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "interne fout" });
    });
});


// DELETE /klassen/{klas_id}/opdrachten/{opdracht_id}/groepen/{groep_id}/conversaties/{conversatie_id}
describe("verwijderConversatie", () => {
    it("moet statuscode 200 teruggeven wanneer verwijderen lukt", async () => {
        const klasId: number = 123;
        const opdrachtId: number = 123;
        const groepId: number = 123;
        const conversatieId: number = 123; 

        // verstuur het DELETE request
        const response = await request(index).delete(`/klassen/${klasId}/opdrachten/${opdrachtId}/groepen/${groepId}/conversaties/${conversatieId}`);
        
        // controlleer de response
        expect(response.status).toBe(200);
    });

    it("moet statuscode 404 terug geven als de conversatie niet gevonden wordt", async () => {
        const klasId: number = 234;
        const groepId: number = 234;
        const opdrachtId: number = 234;
        const conversatieId: number = 234; 

        // verstuur het DELETE request
        const response = await request(index).delete(`/klassen/${klasId}/opdrachten/${opdrachtId}/groepen/${groepId}/conversaties/${conversatieId}`);
        
        // controlleer de response
        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            error: `conversatie ${conversatieId} niet gevonden`
        });
    });

    it("moet statuscode 400 terug geven bij een ongeldig klasId", async () => {
        const opdrachtId: number = 123;
        const groepId: number = 123;
        const conversatieId: number = 123;

        // verstuur het DELETE request
        const response = await request(index).delete(`/klassen/abc/opdrachten/${opdrachtId}/groepen/${groepId}/conversaties/${conversatieId}`);
        
        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            "error": "fout geformateerde link",
            "details": [
                {
                    "validation": "regex",
                    "code": "invalid_string",
                    "message": "geen geldig klasId",
                    "path": [
                        "klas_id"
                    ]
                }
            ]
        });
    });
    
    it("moet statuscode 400 terug geven bij een ongeldig opdrachtId", async () => {
        const klasId: number = 123;
        const groepId: number = 123;
        const conversatieId: number = 123;

        // verstuur het DELETE request
        const response = await request(index).delete(`/klassen/${klasId}/opdrachten/abc/groepen/${groepId}/conversaties/${conversatieId}`);
        
        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            "error": "fout geformateerde link",
            "details": [
                {
                    "validation": "regex",
                    "code": "invalid_string",
                    "message": "geen geldig opdrachtId",
                    "path": [
                        "opdracht_id"
                    ]
                }
            ]
        });
    });

    it("moet statuscode 400 terug geven bij een ongeldig groepId", async () => {
        const klasId: number = 123;
        const opdrachtId: number = 123;
        const conversatieId: number = 123;

        // verstuur het DELETE request
        const response = await request(index).delete(`/klassen/${klasId}/opdrachten/${opdrachtId}/groepen/abc/conversaties/${conversatieId}`);
        
        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            "error": "fout geformateerde link",
            "details": [
                {
                    "validation": "regex",
                    "code": "invalid_string",
                    "message": "geen geldig groepId",
                    "path": [
                        "groep_id"
                    ]
                }
            ]
        });
    });

    it("moet statuscode 400 terug geven bij een ongeldig conversatieId", async () => {
        const klasId: number = 123;
        const opdrachtId: number = 123;
        const groepId: number = 123;

        // verstuur het DELETE request
        const response = await request(index).delete(`/klassen/${klasId}/opdrachten/${opdrachtId}/groepen/${groepId}/conversaties/abc`);
        
        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            "error": "fout geformateerde link",
            "details": [
                {
                    "validation": "regex",
                    "code": "invalid_string",
                    "message": "geen geldig conversatieId",
                    "path": [
                        "conversatie_id"
                    ]
                }
            ]
        });
    });

    it("moet statuscode 500 teruggeven bij een interne fout", async () => {
        const klasId: number = 123;
        const opdrachtId: number = 123;
        const groepId: number = 123;
        const conversatieId: number = 123;
        
        // simuleer een interne fout door de prisma methode te mocken
        vi.spyOn(prisma.classStudent, 'delete').mockRejectedValueOnce(new Error('Internal Error'));

        // verstuur het DELETE request
        const response = await request(index).delete(`/klassen/${klasId}/opdrachten/${opdrachtId}/groepen/${groepId}/conversaties/${conversatieId}`);
        
        // controlleer de response
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "interne fout" });
    });
});