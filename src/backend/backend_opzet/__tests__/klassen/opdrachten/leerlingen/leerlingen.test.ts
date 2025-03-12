import request from "supertest";
import { describe, expect, it, vi, beforeAll } from "vitest";
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
        console.log(response.body)
    });
}); 