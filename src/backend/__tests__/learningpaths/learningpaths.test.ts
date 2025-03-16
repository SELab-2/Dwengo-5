import request from "supertest";
import {describe, expect, it} from "vitest";
import index from '../../index.ts';

// GET /learningpaths?language
describe("learningpaths", (): void => {
    it("get all learning_paths configures in seed.ts", async (): Promise<void> => {
        let res = await request(index).get("/learningpaths?language=en");
        expect(res.status).toBe(200);
        expect(res.body.learningpaths).toHaveLength(2);
        expect(res.body.learningpaths[0]).toBe("/learningpaths/550e8400-e29b-41d4-a716-446655440000");
        expect(res.body.learningpaths[1]).toBe('/learningpaths/550e8400-e29b-41d4-a716-446655440001')
    });
});

// GET /learningpaths/:learningpathId
describe("learningpath", (): void => {
    it("get all learning_paths configures in seed.ts", async (): Promise<void> => {
        let res = await request(index).get("/learningpaths/550e8400-e29b-41d4-a716-446655440001");
        expect(res.status).toBe(200);
        expect(res.body.name).toBe("550e8400-e29b-41d4-a716-446655440001");
        expect(res.body.content).toBe("/learningpaths/550e8400-e29b-41d4-a716-446655440001/content");
        expect(res.body.image).toBe(null);
        expect(res.body.description).toBe("")
    });
});

// GET /learningpaths/:learningpathId/content
describe("learningpath", (): void => {
    // todo ik zit vast
    it("get all learning_paths configures in seed.ts", async (): Promise<void> => {
        let res = await request(index).get("/learningpaths/550e8400-e29b-41d4-a716-446655440001/content");
        expect(res.status).toBe(200);
    });
});