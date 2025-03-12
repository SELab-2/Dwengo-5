import {describe, vi, it, beforeAll, expect} from "vitest";
import request from "supertest";
import index from "../../../index.ts";
import {website_base} from "../../hulpfuncties.ts";
import exp from "node:constants";
import {z} from "zod";

vi.mock("../prismaClient", () => ({
    classStudent: {
        findMany: vi.fn(),
    },
}));

let authToken: string;

beforeAll(async () => {
    // Perform login as teacher1
    const loginPayload = {
        email: "teacher1@example.com",
        password: "test",
    };

    const response = await request(index).post("/authenticatie/aanmelden?gebruikerstype=leerkracht").send(loginPayload);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");

    authToken = response.body.token;
});


// // Insert Assignments
// const assignment1 = await prisma.assignment.upsert({
//     where: { id: 1 },
//     update: {},
//     create: {
//         name: 'Algebra Test',
//         deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // One week from now
//         created_at: new Date(),
//         learning_path: learningPath1.uuid,
//         class: class1.id,
//     },
// });

// GET  /klassen/{klas_id}/opdrachten
describe("GET klasOpdrachten", () => {
    it("should return a list of assignments with status code 200", async () => {
        const classId = 1;
        const getAssignmentsResponse = await request(index)
            .get(`/klassen/${classId}/opdrachten`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(getAssignmentsResponse.status).toBe(200);

        expect(getAssignmentsResponse.body.opdrachten).toHaveLength(2); // 2 assignments in mock database associated with class1
        expect(getAssignmentsResponse.body).toEqual({
            opdrachten: [
                website_base + `/klassen/${classId}/opdrachten/1`,      // assignment1
                website_base + `/klassen/${classId}/opdrachten/3`,      // assignment3
            ],
        });
    });

    it("should return an empty list of assignments with status code 200", async () => {
        const classId = 3;
        const getAssignmentsResponse = await request(index)
            .get(`/klassen/${classId}/opdrachten`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(getAssignmentsResponse.status).toBe(200);

        expect(getAssignmentsResponse.body.opdrachten).toHaveLength(0); // 2 assignments in mock database associated with class1
    });

    it("should return an error with status code 400 for invalid classId", async () => {
        const classId = "INVALID_ID";
        const getAssignmentsResponse = await request(index)
            .get(`/klassen/${classId}/opdrachten`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(getAssignmentsResponse.status).toBe(400);
    });
});

describe("POST klasOpdrachten", () => {
    it("should return a new assignment with status code 200", async () => {
        const classId = 1;
        const learningPathUUID = "550e8400-e29b-41d4-a716-446655440000";
        const body = {
            name: 'Thermodynamics Test',
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // One week from now
            learning_path: `/leerpaden/${learningPathUUID}`,
        };


        const postAssignment = await request(index)
            .post(`/klassen/${classId}/opdrachten`)
            .send(body)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(postAssignment.status).toBe(200);
        expect(postAssignment.body).toEqual({
            opdracht: website_base + `/klassen/${classId}/opdrachten/4`,
        });
    });
})