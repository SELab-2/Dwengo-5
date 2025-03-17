import request from "supertest";
import {describe, expect, it} from "vitest";
import index from '../../index.ts';
import {z} from "zod";
import {learningobjectRexp, zLearningpathLink} from "../../help/validation.ts";
import {mathPathUuid, physicsPathUuid} from "../../prisma/seed.ts";

describe("learningpaths", (): void => {
    it("get all learning_paths configures in seed.ts", async (): Promise<void> => {
        const res = await request(index).get("/learningpaths?language=en");
        expect(res.status).toBe(200);
        expect(z.object({
            learningpaths: z.array(zLearningpathLink)
        }).safeParse(res.body).success).toBe(true);
        expect(res.body.learningpaths).toHaveLength(2);
        [mathPathUuid, physicsPathUuid].forEach(uuid =>
            expect(res.body.learningpaths.includes(`/learningpaths/${uuid}`)).toBe(true)
        );
    });
});

describe("learningpath", (): void => {
    it("get \"physics concepts\" learningpath ", async (): Promise<void> => {
        const res = await request(index).get(`/learningpaths/${physicsPathUuid}`);
        expect(res.status).toBe(200);
        expect(z.object({
            name: z.literal(physicsPathUuid),
            content: z.literal(`/learningpaths/${physicsPathUuid}/content`),
            image: z.null(),
            description: z.literal("Basic physics concepts")
        }).safeParse(res.body).success).toBe(true);
    });
});

describe("learningpath", (): void => {
    it("get content of learningpath", async (): Promise<void> => {
        const res = await request(index).get(`/learningpaths/${physicsPathUuid}/content`);
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