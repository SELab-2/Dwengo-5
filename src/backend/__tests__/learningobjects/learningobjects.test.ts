import request from "supertest";
import {beforeAll, afterAll, describe, expect, it} from "vitest";
import index, {prisma} from '../../index.ts';

const errorMessage = "learningObject not found";


describe("learningobject", (): void => {
  beforeAll(async () => {
    await prisma.$executeRaw`BEGIN`;
  });

  afterAll(async () => {
    await prisma.$executeRaw`ROLLBACK`;
  });
    it("krijg een learningobject gegenereert in seed.ts", async (): Promise<void> => {
        let res = await request(index).get("/learningobjects/550e8400-e29b-41d4-a716-446655440002");
        expect(res.status).toBe(200);
        expect(res.body.name).toBe("Algebra Basics")
    });

    it("get the htmlcontent of a learningObject", async (): Promise<void> => {
        let res = await request(index).get("/learningobjects/550e8400-e29b-41d4-a716-446655440002/content");
        expect(res.status).toBe(200);
        expect(res.body.htmlContent).toBe("Introduction to Algebra");
    });

    it("krijg fout code voor opvragen van niet bestaand learningobject", async (): Promise<void> => {
        let res = await request(index).get("/learningobjects/xxxxxxxx");
        expect(res.status).toBe(404);
        expect(res.body.error).toBe(errorMessage)
    });
});


describe("learningobjectcontent", (): void => {
  beforeAll(async () => {
    await prisma.$executeRaw`BEGIN`;
  });

  afterAll(async () => {
    await prisma.$executeRaw`ROLLBACK`;
  });
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
