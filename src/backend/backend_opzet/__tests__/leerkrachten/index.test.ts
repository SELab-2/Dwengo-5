import request from "supertest";
import {describe, expect, it} from "vitest";
import index from '../../index.ts';

describe("Express App", () => {
    it("grote test leerkracht aanmaken", async () => {
        const nieuwe_leerkracht = {
            "naam": "Roberto Saulo"
        };
        const res = await request(index)
            .post("/leerkrachten")
            .send(nieuwe_leerkracht);
        expect(res.status).toBe(200);
        expect(res.body).toEqual({message: "pong"});
    });
});