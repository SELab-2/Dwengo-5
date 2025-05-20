import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";
import index from '../../index.ts';
import { getDbData, learningPath } from "../../prisma/seeddata.ts";
import { learningobjectLink } from "../../help/links.ts";

let learningpaths: learningPath[];

beforeAll(async () => {
    let seeddata = await getDbData();
    learningpaths = seeddata.learningPaths;
});

describe('learningPaths endpoint', () => {
    describe('GET /learningpaths', () => {
        it('get list of all learningPaths', async () => {
            const res = await request(index)
                .get('/learningpaths?language=en')
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('learningpaths');
            expect(Array.isArray(res.body.learningpaths)).toBe(true);
            expect(res.body.learningpaths.sort()).toEqual(
                learningpaths.map(learningpath => `/learningpaths/${learningpath.id}`).sort()
            );
        });

        it('should return 400 for invalid language', async () => {
            const res = await request(index)
                .get('/learningpaths')
            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: "invalid language" });
        });
    });

    describe('GET /learningpaths/:id', () => {
        it('get info of a learningpath', async () => {
            const res = await request(index)
                .get('/learningpaths?language=en')
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('learningpaths');
            expect(Array.isArray(res.body.learningpaths)).toBe(true);

            let chosenLearningPath = learningpaths[0];
            const res2 = await request(index)
                .get(`/learningpaths/${chosenLearningPath.id}`)
            expect(res2.status).toBe(200);
            expect(res2.body.name).toEqual(chosenLearningPath.title);
            expect(res2.body.image).toEqual(chosenLearningPath.image);
            expect(res2.body.description).toEqual(chosenLearningPath.description);
            expect(res2.body).toHaveProperty('links');
            expect(res2.body.links).toHaveProperty('content');
            expect(decodeURIComponent(res2.body.links.content)).toEqual(`/learningpaths/${chosenLearningPath.id}/content`);
        });

        it('should return 404 for non existent learningpath', async () => {
            const res = await request(index)
                .get('/learningpaths/9999')
            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: "learningpath not found" })
        });
    });

    describe('GET /learningpaths/:id/content', () => {
        it('get content of a learningpath', async () => {
            const res = await request(index)
                .get('/learningpaths?language=en')
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('learningpaths');
            expect(Array.isArray(res.body.learningpaths)).toBe(true);

            let chosenLearningPath = learningpaths[0];
            const res2 = await request(index)
                .get(`/learningpaths/${chosenLearningPath.id}/content`)
            expect(res2.status).toBe(200);
            expect(res2.body).toHaveProperty('learningPath');
            expect(Array.isArray(res2.body.learningPath)).toBe(true);
            expect(res2.body.learningPath.length).toBeGreaterThan(0);
            expect(res2.body.learningPath.map(lpn => lpn.learningObject).sort()).toEqual(
                chosenLearningPath.learning_path_nodes.map(lpn => learningobjectLink(lpn.learning_object_id)).sort()
            );

        });

        it('should return 404 for non existent learningpath', async () => {
            const res = await request(index)
                .get('/learningpaths/9999/content')
            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: "learningpath not found" })
        });
    });
});
