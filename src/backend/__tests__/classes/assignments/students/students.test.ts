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
        const response = await request(index)
            .get(`/classes/1/assignments/5/students`);
        expect(response.status).toBe(200);
        expect(response.body.students).toHaveLength(1);
        expect(response.body.students[0]).toBe("/students/1")
    });

    it("kan opdracht id bestaat niet", async () => {
        const response = await request(index)
            .get(`/classes/1/assignments/50/students`);
        expect(response.status).toBe(404)
    });

    it("kan opdracht id bestaat niet", async () => {
        const response = await request(index)
            .post(`/classes/1/assignments/5/students/`)
            .send({
                student: `/students/3`
            });
        expect(response.status).toBe(200);

        const response2 = await request(index)
            .get(`/classes/1/assignments/5/students`);
        expect(response2.status).toBe(200);
        expect(response2.body.students).toHaveLength(2);
        expect(response2.body.students[0]).toBe("/students/1");
        expect(response2.body.students[1]).toBe("/students/3")


    });


    it("kan opdracht id bestaat niet", async () => {

        const response = await request(index)
            .delete(`/classes/1/assignments/5/students/3`);
        expect(response.status).toBe(200);


        const response2 = await request(index)
            .get(`/classes/1/assignments/5/students`);
        expect(response2.status).toBe(200);
        expect(response2.body.students).toHaveLength(1);
    });
});

