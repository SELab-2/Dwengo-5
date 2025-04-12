import {beforeAll, describe, expect, it, vi} from "vitest";
import request from "supertest";
import index from "../../../index.ts";
import {splitId} from "../../../help/links.ts";

vi.mock("../prismaClient", () => ({
    classStudent: {
        findMany: vi.fn()
    }
}));

let authToken: string;
const classId: number = 1;
const invalidId = "INVALID_ID";
const randomId = 696969;
const learningPathUUID = "550e8400-e29b-41d4-a716-446655440000";
let assignmentLength: number;
let assignmentId: number;

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


describe('ClassAssignment initial state', () => {
    it ("init state", async () => {
        const get = await request(index)
            .get(`/classes/${classId}/assignments`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(get.status).toBe(200);
        expect(get.body).toHaveProperty('assignments');
        assignmentLength = get.body.assignments.length;
    });
});

describe('ClassAssignment lifecylce', () => {
    it ("get all assignments", async () => {
        const getAll = await request(index)
            .get(`/classes/${classId}/assignments`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(getAll.status).toBe(200);
        expect(getAll.body).toHaveProperty('assignments');
        expect(getAll.body.assignments).toHaveLength(assignmentLength);
    });

    it("create assignment", async () => {
        const body = {
            name: 'Thermodynamics Test',
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // One week from now
            learningpath: `/learningpaths/${learningPathUUID}`,
        };

        const postAssignment = await request(index)
            .post(`/classes/${classId}/assignments`)
            .send(body)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(postAssignment.status).toBe(200);
        expect(postAssignment.body)

        expect(postAssignment.body).toHaveProperty('assignment');
        assignmentId = splitId(postAssignment.body.assignment);
    });

    it ("get all assignments", async () => {
        const getAll = await request(index)
            .get(`/classes/${classId}/assignments`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(getAll.status).toBe(200);
        expect(getAll.body).toHaveProperty('assignments');
        expect(getAll.body.assignments).toHaveLength(assignmentLength + 1);
    });

    it("get assignment", async () => {
        const getAssignment = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(getAssignment.status).toBe(200);
        expect(getAssignment.body.name).toEqual("Thermodynamics Test");
    });

    it("delete assignment", async () => {
        const deleteAssignment = await request(index)
            .delete(`/classes/${classId}/assignments/${assignmentId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(deleteAssignment.status).toBe(200);
    });

    it("check all assignments", async () => {
        const getAll = await request(index)
            .get(`/classes/${classId}/assignments`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(getAll.status).toBe(200);
        expect(getAll.body).toHaveProperty('assignments');
        expect(getAll.body.assignments).toHaveLength(assignmentLength);
    });
});

describe("GET all ClassAssignments edgecases", () => {
    it("invalid classId", async () => {
        const classId = "INVALID_ID";
        const getAssignmentsResponse = await request(index)
            .get(`/classes/${classId}/assignments`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(getAssignmentsResponse.status).toBe(400);
    });

    it ('no auth', async () => {
        const getAssignmentsResponse = await request(index)
            .get(`/classes/${classId}/assignments`);
        expect(getAssignmentsResponse.status).toBe(401);
    });
});

describe("GET ClassAssignment edgecases", () => {
    it ('invalid classId', async () => {
        const getAssignmentsResponse = await request(index)
            .get(`/classes/${invalidId}/assignments/1`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(getAssignmentsResponse.status).toBe(400);
    });

    it ('invalid assignmentId', async () => {
        const getAssignmentsResponse = await request(index)
            .get(`/classes/${classId}/assignments/${invalidId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(getAssignmentsResponse.status).toBe(400);
    });

    it ('not found', async () => {
        const getAssignmentsResponse = await request(index)
            .get(`/classes/${classId}/assignments/${randomId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(getAssignmentsResponse.status).toBe(404);
    });

    it ('no auth', async () => {
        const getAssignmentsResponse = await request(index)
            .get(`/classes/${classId}/assignments/1`);
        expect(getAssignmentsResponse.status).toBe(401);
    });
})


describe("POST ClassAssignments edgecases", () => {
    it("invalid classId", async () => {
        const body = {
            name: 'Thermodynamics Test',
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // One week from now
            learningpath: `/learningpaths/${learningPathUUID}`
        };

        const postAssignment = await request(index)
            .post(`/classes/${invalidId}/assignments`)
            .send(body)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(postAssignment.status).toBe(400);
    });

    it("invalid learningPath uuid", async () => {
        const body = {
            name: 'Thermodynamics Test',
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // One week from now
            learningpath: `/${invalidId}/${invalidId}`
        };

        const postAssignment = await request(index)
            .post(`/classes/${classId}/assignments`)
            .send(body)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(postAssignment.status).toBe(400);
    });

    it ('invalid deadline', async () => {
        const body = {
            name: 'Thermodynamics Test',
            deadline: "INVALID_DATE",
            learningpath: `/learningpaths/${learningPathUUID}`
        };

        const postAssignment = await request(index)
            .post(`/classes/${classId}/assignments`)
            .send(body)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(postAssignment.status).toBe(400);
    });
});

    it ('no auth', async () => {
        const body = {
            name: 'Thermodynamics Test',
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // One week from now
            learningpath: `/learningpaths/${learningPathUUID}`,
        };

        const postAssignment = await request(index)
            .post(`/classes/${classId}/assignments`)
            .send(body);
        expect(postAssignment.status).toBe(401);
    });
});

describe("DELETE ClassAssignment edgecases", () => {
    it('invalid classId', async () => {
        const classId = "abc";
        const assignmentId = 6;

        const deleteAssignment = await request(index)
            .delete(`/classes/${classId}/assignments/${assignmentId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(deleteAssignment.status).toBe(400);
    });

    it('invalid assignmentId', async () => {
        const classId = 1;
        const assignmentId = "abc";

        const deleteAssignment = await request(index)
            .delete(`/classes/${classId}/assignments/${assignmentId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(deleteAssignment.status).toBe(400);
    });

    it('not found', async () => {
        const deleteAssignment = await request(index)
            .delete(`/classes/${classId}/assignments/${randomId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(deleteAssignment.status).toBe(404);
    });
});