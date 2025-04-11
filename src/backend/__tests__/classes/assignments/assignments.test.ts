import {beforeAll, describe, expect, it, vi} from "vitest";
import request from "supertest";
import index from "../../../index.ts";

vi.mock("../prismaClient", () => ({
    classStudent: {
        findMany: vi.fn()
    }
}));

let authToken: string;

beforeAll(async () => {
    // Perform login as teacher1
    const loginPayload = {
        email: "teacher1@example.com",
        password: "test"
    };

    const res = await request(index).post("/authentication/login?usertype=teacher").send(loginPayload);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");

    authToken = res.body.token;
});


describe("GET klasAssignments", () => {
    it("should return a list of assignments with status code 200", async () => {
        const classId = 1;
        const getAssignmentsResponse = await request(index)
            .get(`/classes/${classId}/assignments`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(getAssignmentsResponse.status).toBe(200);

        expect(getAssignmentsResponse.body.assignments).toHaveLength(4); // 2 assignments in mock database associated with class1
        expect(getAssignmentsResponse.body).toEqual({
            assignments: [
                `/classes/${classId}/assignments/1`,
                `/classes/${classId}/assignments/3`,
                `/classes/${classId}/assignments/4`,
                `/classes/${classId}/assignments/5`,

            ]
        });
    });

    it("should return an empty list of assignments with status code 200", async () => {
        const classId = 3;
        const getAssignmentsResponse = await request(index)
            .get(`/classes/${classId}/assignments`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(getAssignmentsResponse.status).toBe(200);

        expect(getAssignmentsResponse.body.assignments).toHaveLength(0); // 2 assignments in mock database associated with class1
    });

    it("should return an error with status code 400 for invalid classId", async () => {
        const classId = "INVALID_ID";
        const getAssignmentsResponse = await request(index)
            .get(`/classes/${classId}/assignments`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(getAssignmentsResponse.status).toBe(400);
    });
});


describe("POST klasAssignments", () => {
    it("should return a new assignment with status code 200", async () => {
        const classId = 1;
        const learningPathUUID = "550e8400-e29b-41d4-a716-446655440000";
        const body = {
            name: 'Thermodynamics Test',
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // One week from now
            learning_path: `/learningpaths/${learningPathUUID}`
        };


        const postAssignment = await request(index)
            .post(`/classes/${classId}/assignments`)
            .send(body)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(postAssignment.status).toBe(200);
        expect(postAssignment.body).toEqual({
            opdracht: `/classes/${classId}/assignments/6`
        });
    });

    it("should return an error with status code 200 for invalid classId", async () => {
        const classId = "abc";
        const learningPathUUID = "550e8400-e29b-41d4-a716-446655440000";
        const body = {
            name: 'Thermodynamics Test',
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // One week from now
            learning_path: `/learningpaths/${learningPathUUID}`
        };

        const postAssignment = await request(index)
            .post(`/classes/${classId}/assignments`)
            .send(body)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(postAssignment.status).toBe(400);
    });

    it("should return an error with status code 200 for invalid learningPath uuid", async () => {
        const classId = 1;
        const learningPathUUID = "2fbd148a-ab50-4e8e-9e0b-fdf81c4f1fab";
        const body = {
            name: 'Thermodynamics Test',
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // One week from now
            learning_path: `/learningpaths/${learningPathUUID}`
        };

        const postAssignment = await request(index)
            .post(`/classes/${classId}/assignments`)
            .send(body)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(postAssignment.status).toBe(400);
    });
});

describe("GET klasOpdracht", () => {
    it("should return an assignment with status code 200", async () => {
        const classId = 1;
        const assignmentId = 6;
        const learningPathUUID = "550e8400-e29b-41d4-a716-446655440000";

        const getAssignment = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(getAssignment.status).toBe(200);
        expect(getAssignment.body.name).toEqual("Thermodynamics Test");
        expect(getAssignment.body.learning_path).toEqual(`/learningpaths/${learningPathUUID}`);
    });

    it('should throw an error with status code 400 for invalid classId', async () => {
        const classId = "abc";
        const assignmentId = 6;

        const getAssignment = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(getAssignment.status).toBe(400);
    });

    it('should throw an error with status code 400 for invalid assignmentId', async () => {
        const classId = 1;
        const assignmentId = "abc";

        const getAssignment = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(getAssignment.status).toBe(400);
    });


    it("should return an error with status code 404 for wrong classId", async () => {
        const classId = 696969;
        const assignmentId = 6;

        const getAssignment = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(getAssignment.status).toBe(404);
    });

    it("should return error with status code 404 for assignment not found", async () => {
        const classId = 1;
        const assignmentId = 696969;

        const getAssignment = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(getAssignment.status).toBe(404);
    });
});

describe("DELETE klasAssignments", () => {
    it('should delete assignment and return status code 200 ', async () => {
        const classId = 1;
        const assignmentId = 6;
        const learningPathUUID = "550e8400-e29b-41d4-a716-446655440000";

        const deleteAssignment = await request(index)
            .delete(`/classes/${classId}/assignments/${assignmentId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(deleteAssignment.status).toBe(200);

        const getAssignment = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(getAssignment.status).toBe(404);
    });

    it('should throw an error with status code 400 for invalid classId', async () => {
        const classId = "abc";
        const assignmentId = 6;

        const deleteAssignment = await request(index)
            .delete(`/classes/${classId}/assignments/${assignmentId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(deleteAssignment.status).toBe(400);
    });

    it('should throw an error with status code 400 for invalid assignmentId', async () => {
        const classId = 1;
        const assignmentId = "abc";

        const deleteAssignment = await request(index)
            .delete(`/classes/${classId}/assignments/${assignmentId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(deleteAssignment.status).toBe(400);
    });

    it('should throw an error with status code 404', async () => {
        const classId = 1;
        const assignmentId = 696969;

        const deleteAssignment = await request(index)
            .delete(`/classes/${classId}/assignments/${assignmentId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(deleteAssignment.status).toBe(404);
    });
});