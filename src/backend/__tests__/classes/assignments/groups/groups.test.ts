import request from "supertest";
import {beforeAll, describe, expect, it, vi} from "vitest";
import index from '../../../../index.ts';
import {splitId} from "../../../../help/links.ts";

vi.mock("../prismaClient", () => ({
    classStudent: {
        findMany: vi.fn(),
    },
}));


let authToken: string;
let groupsLength: number;
let groupId: number;

beforeAll(async () => {
    // Perform login as teacher1
    const loginPayload = {
        email: "teacher1@example.com",
        password: "test",
    };

    const res = await request(index).post("/authentication/login?usertype=teacher").send(loginPayload);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");

    authToken = res.body.token;
});



describe("AssignmentGroups initial state", () => {
    it('init state', async () => {
        const getAll = await request(index)
            .get('/classes/1/assignments/1/groups')
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(getAll.status).toBe(200);
        expect(getAll.body).toHaveProperty('groups');
        groupsLength = getAll.body.groups.length;
    });
})

describe("AssignmentGroups lifecycle", () => {
    it ('get all groups', async () => {
        const getAll = await request(index)
            .get('/classes/1/assignments/1/groups')
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(getAll.status).toBe(200);
        expect(getAll.body).toHaveProperty('groups');
        expect(getAll.body.groups.length).toBe(groupsLength);
    });

    it ('create group', async () => {
        const createGroup = await request(index)
            .post('/classes/1/assignments/1/groups')
            .set("Authorization", `Bearer ${authToken.trim()}`)
            .send({students: ["/students/1", "/students/2"]});
        expect(createGroup.status).toBe(200);
    });

    it ('get all groups', async () => {
        const getAll = await request(index)
            .get('/classes/1/assignments/1/groups')
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(getAll.status).toBe(200);
        expect(getAll.body).toHaveProperty('groups');
        expect(getAll.body.groups.length).toBe(groupsLength + 1);


        groupId = splitId(getAll.body.groups.at(-1));
    });

    it ('get group', async () => {
        const getAll = await request(index)
            .get(`/classes/1/assignments/1/groups/${groupId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(getAll.status).toBe(200);
        expect(getAll.body).toHaveProperty('links');
        expect(getAll.body.links).toHaveProperty('conversations');
        expect(getAll.body.links).toHaveProperty('students');
    });

    it ('delete group', async () => {
        const deleteGroup = await request(index)
            .delete(`/classes/1/assignments/1/groups/${groupId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(deleteGroup.status).toBe(200);
    });

    it ('check all groups', async () => {
        const getAll = await request(index)
            .get('/classes/1/assignments/1/groups')
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(getAll.status).toBe(200);
        expect(getAll.body).toHaveProperty('groups');
        expect(getAll.body.groups.length).toBe(groupsLength);
    });
})

describe("get all AssignmentGroups edgecases", () => {
    it ('invalid classId', async () => {
        const getAll = await request(index)
            .get('/classes/abc/assignments/1/groups')
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(getAll.status).toBe(400);
    });

    it ('invaid assignmentId', async () => {
        const getAll = await request(index)
            .get('/classes/1/assignments/abc/groups')
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(getAll.status).toBe(400);
    });

    it ('no auth', async () => {
        const getAll = await request(index)
            .get('/classes/1/assignments/1/groups')
        expect(getAll.status).toBe(401);
    });
});

describe('get AssignmentGroup edgecases', () => {
    it ('invalid classId', async () => {
        const getAll = await request(index)
            .get('/classes/abc/assignments/1/groups/1')
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(getAll.status).toBe(400);
    });

    it ('invalid assignmentId', async () => {
        const getAll = await request(index)
            .get('/classes/1/assignments/abc/groups/1')
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(getAll.status).toBe(400);
    });

    it ('invalid groupId', async () => {
        const getAll = await request(index)
            .get('/classes/1/assignments/1/groups/abc')
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(getAll.status).toBe(400);
    });

    it ('no auth', async () => {
        const getAll = await request(index)
            .get('/classes/1/assignments/1/groups/1')
        expect(getAll.status).toBe(401);
    });
});

describe('post AssignmentGroup edgecases', () => {
   it ('invalid classId', async () => {
        const getAll = await request(index)
            .post('/classes/abc/assignments/1/groups')
            .set("Authorization", `Bearer ${authToken.trim()}`)
            .send({students: ["/students/1", "/students/2"]});
        expect(getAll.status).toBe(400);
   });

   it ('invalid assignmentId', async () => {
        const getAll = await request(index)
            .post('/classes/1/assignments/abc/groups')
            .set("Authorization", `Bearer ${authToken.trim()}`)
            .send({students: ["/students/1", "/students/2"]});
        expect(getAll.status).toBe(400);
   });

   it ('invalid body (studentlinks)', async () => {
        const getAll = await request(index)
            .post('/classes/1/assignments/1/groups')
            .set("Authorization", `Bearer ${authToken.trim()}`)
            .send({students: ["/fout/1", "/students/xc"]});
        expect(getAll.status).toBe(400);
   });

    it ('no auth', async () => {
        const getAll = await request(index)
            .post('/classes/1/assignments/1/groups')
            .send({students: ["/students/1", "/students/2"]});
        expect(getAll.status).toBe(401);
    });

    it ('assignment not found', async () => {
        const getAll = await request(index)
            .post('/classes/1/assignments/100/groups')
            .set("Authorization", `Bearer ${authToken.trim()}`)
            .send({students: ["/students/1", "/students/2"]});
        expect(getAll.status).toBe(404);
    });
});

describe('delete AssignmentGroup edgecases', () => {
    it ('invalid classId', async () => {
        const getAll = await request(index)
            .delete('/classes/abc/assignments/1/groups/1')
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(getAll.status).toBe(400);
    });

    it ('invalid assignmentId', async () => {
        const getAll = await request(index)
            .delete('/classes/1/assignments/abc/groups/1')
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(getAll.status).toBe(400);
    });

    it ('invalid groupId', async () => {
        const getAll = await request(index)
            .delete('/classes/1/assignments/1/groups/abc')
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(getAll.status).toBe(400);
    });

    it ('no auth', async () => {
        const getAll = await request(index)
            .delete('/classes/1/assignments/1/groups/1')
        expect(getAll.status).toBe(401);
    });

    it ('assignment not found', async () => {
        const getAll = await request(index)
            .delete('/classes/1/assignments/100/groups/1')
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(getAll.status).toBe(404);
    });
});

// describe("opdrachtGroepen", () => {
//     it("moet een lijst van groups teruggeven met statuscode 200", async () => {
//         const classId: number = 1;
//         const assignmentId: number = 1;
//
//                 const res = await request(index)
//             .get(`/classes/${classId}/assignments/${assignmentId}/groups`)
//             .set("Authorization", `Bearer ${authToken.trim()}`);
//
//                 expect(res.status).toBe(200);
//         expect(res.body.groups).toHaveLength(1);
//         expect(res.body).toEqual({
//             groups: [
//                 `/classes/${classId}/assignments/${assignmentId}/groups/1`,
//             ]
//         });
//     });
//
//     it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
//         const assignmentId: number = 1;
//
//                 const res = await request(index)
//             .get(`/classes/abc/assignments/${assignmentId}/groups`)
//             .set("Authorization", `Bearer ${authToken.trim()}`);
//
//                 expect(res.status).toBe(400);
//         expect(res.body).toEqual({"error": "invalid classId"});
//     });
//
//     it("moet statuscode 400 terug geven bij een ongeldig assignmentId", async () => {
//         const classId: number = 1;
//
//                 const res = await request(index)
//             .get(`/classes/${classId}/assignments/abc/groups`)
//             .set("Authorization", `Bearer ${authToken.trim()}`);
//
//                 expect(res.status).toBe(400);
//         expect(res.body).toEqual({"error": "invalid assignmentId"});
//     });
// });
//
//
// describe("opdrachtMaakGroep", () => {
//     it("moet een de nieuwe groep teruggeven met statuscode 200", async () => {
//         const classId: number = 1;
//         const assignmentId: number = 3;
//         const body = {students: ["/students/1", "/students/2"]};
//
//                 const res = await request(index)
//             .post(`/classes/${classId}/assignments/${assignmentId}/groups`).send(body)
//             .set("Authorization", `Bearer ${authToken.trim()}`);
//
//                 expect(res.status).toBe(200);
//     });
//
//     it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
//         const assignmentId: number = 3;
//         const body = {students: ["/students/1", "/students/2"]};
//
//                 const res = await request(index)
//             .post(`/classes/abc/assignments/${assignmentId}/groups`).send(body)
//             .set("Authorization", `Bearer ${authToken.trim()}`);
//
//                 expect(res.status).toBe(400);
//         expect(res.body).toEqual({"error": "invalid classId"});
//     });
//
//     it("moet statuscode 400 terug geven bij een ongeldig assignmentId", async () => {
//         const classId: number = 1;
//         const body = {students: ["/students/1", "/students/2"]};
//
//                 const res = await request(index)
//             .post(`/classes/${classId}/assignments/abc/groups`).send(body)
//             .set("Authorization", `Bearer ${authToken.trim()}`);
//
//                 expect(res.status).toBe(400);
//         expect(res.body).toEqual({"error": "invalid assignmentId"});
//     });
//
//     it("moet statuscode 400 terug geven bij een ongeldige body", async () => {
//         const classId: number = 1;
//         const assignmentId: number = 1;
//         const body = {students: ["/fout/1", "/students/xc"]};
//
//                 const res = await request(index)
//             .post(`/classes/${classId}/assignments/${assignmentId}/groups`).send(body)
//             .set("Authorization", `Bearer ${authToken.trim()}`);
//
//                 expect(res.status).toBe(400);
//         expect(res.body).toEqual({"error": "wrong body"});
//     });
// });
//
//
//
// describe("opdrachtVerwijderGroep", () => {
//     it("moet statuscode 200 teruggeven wanneer verwijderen lukt", async () => {
//         const classId: number = 1;
//         const assignmentId: number = 1;
//         const groupId: number = 1;
//
//                 const res = await request(index)
//             .delete(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}`)
//             .set("Authorization", `Bearer ${authToken.trim()}`);
//
//                 expect(res.status).toBe(200);
//     });
//
//     it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
//         const assignmentId: number = 1;
//         const groupId: number = 1;
//
//                 const res = await request(index)
//             .delete(`/classes/abc/assignments/${assignmentId}/groups/${groupId}`)
//             .set("Authorization", `Bearer ${authToken.trim()}`);
//
//                 expect(res.status).toBe(400);
//         expect(res.body).toEqual({"error": "invalid classId"});
//     });
//
//     it("moet statuscode 400 terug geven bij een ongeldig assignmentId", async () => {
//         const classId: number = 1;
//         const groupId: number = 1;
//
//                 const res = await request(index)
//             .delete(`/classes/${classId}/assignments/abc/groups/${groupId}`)
//             .set("Authorization", `Bearer ${authToken.trim()}`);
//
//                 expect(res.status).toBe(400);
//         expect(res.body).toEqual({"error": "invalid assignmentId"});
//     });
//
//     it("moet statuscode 400 terug geven bij een ongeldig groupId", async () => {
//         const classId: number = 1;
//         const assignmentId: number = 1;
//
//                 const res = await request(index)
//             .delete(`/classes/${classId}/assignments/${assignmentId}/groups/abc`)
//             .set("Authorization", `Bearer ${authToken.trim()}`);
//
//                 expect(res.status).toBe(400);
//         expect(res.body).toEqual({"error": "invalid groupId"});
//     });
// });