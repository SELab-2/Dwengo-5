import request from "supertest";
import { describe, it, expect } from "vitest";
import index from "../index.ts";
import {z} from "zod";

describe("Express App", () => {
  it("als ge /ping doet, dan doet hij pong", async () => {
    const res = await request(index).get("/ping");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ error: "pong" });
  });
});
