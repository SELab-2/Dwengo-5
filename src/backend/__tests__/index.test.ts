import request from "supertest";
import { beforeAll, afterAll, describe, expect, it } from "vitest";
import index, { prisma } from "../index.ts";

describe("Express App", () => {
  beforeAll(async () => {
    await prisma.$executeRaw`BEGIN`;
  });

  afterAll(async () => {
    await prisma.$executeRaw`ROLLBACK`;
  });
  it("als ge /ping doet, dan doet hij pong", async () => {
    const res = await request(index).get("/ping");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ error: "pong" });
  });
});
