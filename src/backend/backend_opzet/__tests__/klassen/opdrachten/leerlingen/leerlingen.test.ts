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
            .get(`/klassen/1/opdrachten/5/leerlingen`)
        expect(response.status).toBe(200)
        expect(response.body).toHaveLength(4);
        expect(response.body[0]).toBe("www.dwengo.be/leerlingen/1")
    });

    it("kan opdracht id bestaat niet", async () => {
        const response = await request(index)
            .get(`/klassen/1/opdrachten/50/leerlingen`)
        expect(response.status).toBe(404)
    });

    it("kan opdracht id bestaat niet", async () => {
        const response = await request(index)
            .post(`/klassen/1/opdrachten/5/leerlingen/3`)
        expect(response.status).toBe(200)
    });

    it("kan opdracht id bestaat niet", async () => {
        const response = await request(index)
            .delete(`/klassen/1/opdrachten/5/leerlingen/3`)
        //expect(response.status).toBe(200)
    });
}); 

