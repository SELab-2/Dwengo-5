import request, {Response} from "supertest";
import {describe, expect, it} from "vitest";
import index, {website_base} from '../../index.ts';

const errorMessage = "learningObject not found"

// GET /learningobjects/:leerobjectid
describe("leerobject", (): void => {
  it("krijg een leerobject gegenereert in seed.ts", async (): Promise<void> => {
    let res = await request(index).get("/leerobjecten/550e8400-e29b-41d4-a716-446655440002");
    expect(res.status).toBe(200);
    expect(res.body.content).toBe("/learningobjects/550e8400-e29b-41d4-a716-446655440002/content")
    expect(res.body.name).toBe("Algebra Basics")
  });

  it("krijg fout code voor opvragen van niet bestaand leerobject", async (): Promise<void> => {
    let res = await request(index).get("/leerobjecten/xxxxxxxx");
    expect(res.status).toBe(404);
    expect(res.body.error).toBe(errorMessage)
  });
});

// GET /leerobjeten/:learningObjectId/content
describe("leerobjectcontent", (): void => {
  it("krijg content van een leerobject gegenereert in seed.ts", async (): Promise<void> => {
    let res = await request(index).get("/leerobjecten/550e8400-e29b-41d4-a716-446655440003/content");
    expect(res.status).toBe(200);
    expect(res.body.htmlContent).toBe("Introduction to Thermodynamics")
  });

  it("krijg fout code voor opvragen van content van niet bestaand leerobject", async (): Promise<void> => {
    let res = await request(index).get("/leerobjecten/xxxxxxxx/content");
    expect(res.status).toBe(404);
    expect(res.body.error).toBe(errorMessage)
  });
});
