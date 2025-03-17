import request from "supertest";
import {describe, expect, it} from "vitest";
import index from '../../index.ts';
import {z} from "zod";
import {learningobjectRexp} from "../../help/validation.ts";

describe("learningpaths", (): void => {
    it("get all learning_paths configures in seed.ts", async (): Promise<void> => {
        const res = await request(index).get("/learningpaths?language=en");
        expect(res.status).toBe(200);
        expect(res.body.learningpaths).toHaveLength(2);
        expect(res.body.learningpaths[0]).toBe("/learningpaths/550e8400-e29b-41d4-a716-446655440000");
        expect(res.body.learningpaths[1]).toBe('/learningpaths/550e8400-e29b-41d4-a716-446655440001')
    });
});

describe("learningpath", (): void => {
    it("get \"physics concepts\" learningpath ", async (): Promise<void> => {
        const res = await request(index).get("/learningpaths/550e8400-e29b-41d4-a716-446655440001");
        expect(res.status).toBe(200);
        expect(res.body.name).toBe("550e8400-e29b-41d4-a716-446655440001");
        expect(res.body.content).toBe("/learningpaths/550e8400-e29b-41d4-a716-446655440001/content");
        expect(res.body.image).toBe(null);
        expect(res.body.description).toBe("Basic physics concepts");
    });
});

describe("learningpath", (): void => {
    it("get content of learningpath", async (): Promise<void> => {
        const res = await request(index).get("/learningpaths/550e8400-e29b-41d4-a716-446655440001/content");
        expect(res.status).toBe(200);
        expect(z.array(z.object({
            eerste_object_in_graaf: z.coerce.boolean(),
            learningobject: z.string().regex(learningobjectRexp),
            volgende: z.array(z.object({
                learningobject: z.string().regex(learningobjectRexp),
                vereisten: z.tuple([z.number(), z.number()])
            }))
        })).safeParse(res.body).success).toBe(true);
    });
});