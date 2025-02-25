import request from "supertest";
import { describe, it, expect } from "vitest";
import index from '../index.ts';

describe("Express App", () => {
    it("should return pong from GET /ping", async () => {
        const res = await request(index).get("/ping");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: "pong" });
    });
});