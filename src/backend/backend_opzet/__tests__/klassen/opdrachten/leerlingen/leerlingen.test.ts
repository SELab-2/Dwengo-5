import request from "supertest";
import { describe, expect, it, vi, beforeAll, test } from "vitest";
import index, { website_base } from '../../../../index.ts';

vi.mock("../prismaClient", () => ({
    classStudent: {
        findMany: vi.fn()
    }
}));

describe("opdrachtConversaties", () => {
    
    it("moet een lijst van leerlingen teruggeven met statuscode 200", async () => {
        const response = await request(index)
            .get(`/klassen/1/opdrachten/5/leerlingen`);
        expect(response.status).toBe(200);
        expect(response.body.leerlingen).toHaveLength(1);
        expect(response.body.leerlingen[0]).toBe("/leerlingen/1")
    });

    it("kan opdracht id bestaat niet", async () => {
        const response = await request(index)
            .get(`/klassen/1/opdrachten/50/leerlingen`);
        expect(response.status).toBe(404)
    });

    it("kan opdracht id bestaat niet", async () => {
        const response = await request(index)
            .post(`/klassen/1/opdrachten/5/leerlingen/`)
            .send({
                leerling:`/leerlingen/3`
            });
        expect(response.status).toBe(200);

        const response2 = await request(index)
            .get(`/klassen/1/opdrachten/5/leerlingen`);
        expect(response2.status).toBe(200);
        expect(response2.body.leerlingen).toHaveLength(2);
        expect(response2.body.leerlingen[0]).toBe("/leerlingen/1");
        expect(response2.body.leerlingen[1]).toBe("/leerlingen/3")


    });

    
    it("kan opdracht id bestaat niet", async () => {
        
        const response = await request(index)
            .delete(`/klassen/1/opdrachten/5/leerlingen/3`);
        expect(response.status).toBe(200);
        

        const response2 = await request(index)
            .get(`/klassen/1/opdrachten/5/leerlingen`);
        expect(response2.status).toBe(200);
        expect(response2.body.leerlingen).toHaveLength(1);
    });
});

