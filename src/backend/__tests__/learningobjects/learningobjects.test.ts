import request from "supertest";
import {describe, expect, it} from "vitest";
import index from '../../index.ts';

const errorMessage = "learningObject not found";

// GET /learningobjects/:learningobjectid
describe("learningobject", (): void => {
    it("krijg een learningobject gegenereert in seed.ts", async (): Promise<void> => {
        let res = await request(index).get("/learningobjects/550e8400-e29b-41d4-a716-446655440002");
        expect(res.status).toBe(200);
        expect(res.body.content).toBe("/learningobjects/550e8400-e29b-41d4-a716-446655440002/content");
        expect(res.body.name).toBe("Algebra Basics")
    });

    it("krijg fout code voor opvragen van niet bestaand learningobject", async (): Promise<void> => {
        let res = await request(index).get("/learningobjects/xxxxxxxx");
        expect(res.status).toBe(404);
        expect(res.body.error).toBe(errorMessage)
    });
});

// GET /leerobjeten/:learningObjectId/content
describe("learningobjectcontent", (): void => {
    it("krijg content van een learningobject gegenereert in seed.ts", async (): Promise<void> => {
        let res = await request(index).get("/learningobjects/550e8400-e29b-41d4-a716-446655440003/content");
        expect(res.status).toBe(200);
        expect(res.body.htmlContent).toBe("Introduction to Thermodynamics")
    });

    it("krijg fout code voor opvragen van content van niet bestaand learningobject", async (): Promise<void> => {
        let res = await request(index).get("/learningobjects/xxxxxxxx/content");
        expect(res.status).toBe(404);
        expect(res.body.error).toBe(errorMessage)
    });
});
