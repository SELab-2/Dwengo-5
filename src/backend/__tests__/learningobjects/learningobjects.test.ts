import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";
import index from '../../index.ts';
import { getDbData, learningObject } from "../../prisma/seeddata.ts";
import { learningobjectLink } from "../../help/links.ts";

let learningobjects: learningObject[];

beforeAll(async () => {
    let seeddata = await getDbData();
    learningobjects = seeddata.learningObjects;
});

describe("learningobjects endpoint", () => {
    describe("GET /learningobjects/:id", () => {
        it("get info of a learningobject", async () => {
            let chosenLearningObject = learningobjects[0];

            let res = await request(index)
                .get(`/learningobjects/${chosenLearningObject.id}`);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                name: chosenLearningObject.title,
                difficulty: chosenLearningObject.difficulty,
                description: chosenLearningObject.description,
                estimated_time: chosenLearningObject.estimated_time,
                skos_concepts: chosenLearningObject.skos_concepts,
                links: {
                    content: `/learningobjects/${chosenLearningObject.id}/content`,
                }
            })
        })

        it('should return 404 for non existent learningobject', async () => {
            const res = await request(index)
                .get('/learningobjects/9999')
            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: "learningObject not found" })
        });
    });

    describe("GET /learningobjects/:id/content", () => {
        it('get content of learningobject', async () => {
            let chosenLearningObject = learningobjects[0];

            const res = await request(index)
                .get(`/learningobjects/${chosenLearningObject.id}/content`);
            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                htmlContent: chosenLearningObject.html_content
            })
        });

        it('should return 404 for non existent learningobject', async () => {
            const res = await request(index)
                .get('/learningobjects/9999/content')
            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: "learningObject not found" })
        })
    });
});