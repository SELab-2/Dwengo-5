import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import index from '../../../../index.ts';
import {PrismaClient} from "@prisma/client";
const prisma = new PrismaClient();

vi.mock("../prismaClient", () => ({
    classStudent: {
        findMany: vi.fn()
    }
}));

// GET /klassen/{klas_id}/opdrachten/{opdracht_id}/conversaties
describe("opdrachtConversaties", () => {
    it("moet een lijst van conversaties teruggeven met statuscode 200", async () => {
        const klasId: number = 123;
        const opdrachtId: number = 123;
        const groepId: number = 234;
        const conversatieId: number = 234; 

        // verstuur het GET request
        const response = await request(index).get(`/klassen/${klasId}/opdrachten/${opdrachtId}/conversaties`);
        
        // controlleer de response
        expect(response.status).toBe(200);
        expect(response.body.conversaties).toHaveLength(1);
        expect(response.body).toEqual({
            leerlingen: [`/klassen/${klasId}/opdrachten/${opdrachtId}/groepen/${groepId}/conversaties/${conversatieId}`]
        });
    });

    it("moet een lege lijst teruggeven als er geen conversaties voor de opdracht zijn", async () => {
        const klasId: number = 234;
        const opdrachtId: number = 234;

        // verstuur het GET request
        const response = await request(index).get(`/klassen/${klasId}/opdrachten/${opdrachtId}/conversaties`);
        
        // controlleer de response
        expect(response.status).toBe(200);
        expect(response.body.leerlingen).toHaveLength(0);
        expect(response.body).toEqual({
            leerlingen: []
        });
    });

    it("moet statuscode 400 terug geven bij een ongeldig klasId", async () => {
        const opdrachtId: number = 123;

        // verstuur het GET request
        const response = await request(index).get(`/klassen/abc/opdrachten/${opdrachtId}/conversaties`);
        
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

        // verstuur het GET request
        const response = await request(index).get(`/klassen/${klasId}/opdrachten/abc/conversaties`);
        
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

    it("moet statuscode 500 teruggeven bij een interne fout", async () => {
        const klasId: number = 123;
        const opdrachtId: number = 123;
        // simuleer een interne fout door de prisma methode te mocken
        vi.spyOn(prisma.classStudent, 'findMany').mockRejectedValueOnce(new Error('Internal Error'));

        // verstuur het GET request
        const response = await request(index).get(`/klassen/${klasId}/opdrachten/${opdrachtId}/conversaties`);
        
        // controlleer de response
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "interne fout" });
    });
});