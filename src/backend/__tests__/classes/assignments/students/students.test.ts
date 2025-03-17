import request from "supertest";
import {describe, expect, it, vi} from "vitest";
import index from '../../../../index.ts';

vi.mock("../prismaClient", () => ({
    classStudent: {
        findMany: vi.fn()
    }
}));

describe("opdrachtConversaties", () => {

    it("moet een lijst van students teruggeven met statuscode 200", async () => {
        const res = await request(index)
            .get(`/classes/1/assignments/5/students`);
        expect(res.status).toBe(200);
        expect(res.body.students).toHaveLength(1);
        expect(res.body.students[0]).toBe("/students/1")
    });

    it("kan opdracht id bestaat niet", async () => {
        const res = await request(index)
            .get(`/classes/1/assignments/50/students`);
        expect(res.status).toBe(404)
    });

    it("kan opdracht id bestaat niet", async () => {
        const res = await request(index)
            .post(`/classes/1/assignments/5/students/`)
            .send({
                student: `/students/3`
            });
        expect(res.status).toBe(200);

        const res2 = await request(index)
            .get(`/classes/1/assignments/5/students`);
        expect(res2.status).toBe(200);
        expect(res2.body.students).toHaveLength(2);
        expect(res2.body.students[0]).toBe("/students/1");
        expect(res2.body.students[1]).toBe("/students/3")


    });


    it("kan opdracht id bestaat niet", async () => {

        const res = await request(index)
            .delete(`/classes/1/assignments/5/students/3`);
        expect(res.status).toBe(200);


        const res2 = await request(index)
            .get(`/classes/1/assignments/5/students`);
        expect(res2.status).toBe(200);
        expect(res2.body.students).toHaveLength(1);
    });
});

