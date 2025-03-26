import request from "supertest";
import {beforeAll, describe, expect, it, vi} from "vitest";
import index from "../../../index.ts";

vi.mock("../prismaClient", () => ({
    classStudent: {
        findMany: vi.fn(),
    },
}));


let authToken: string;
let studentLength: number;
let waitingRoomLength: number;
const classId = 1;

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


describe("klasleerlingen initial state", () => {
    it('initial state', async () => {
        const res = await request(index)
            .get(`/classes/${classId}/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(200);
        expect(res.body.students).toHaveLength(2);
        expect(res.body).toHaveProperty('students');
        expect(res.body).toHaveProperty('waitingroom');

        studentLength = res.body.students.length;
        waitingRoomLength = res.body.waitingroom.length;
    });
});

describe("klasLeerling lifecycle", () => {
    it ("post klasLeerling", async () => {
        const post = await request(index)
            .post(`/classes/${classId}/students`)
            .send("/students/3")
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(post.status).toBe(200);
    });

    it ("get all klasLeerlingen", async () => {
        const res = await request(index)
            .get(`/classes/${classId}/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(200);
        expect(res.body.students).toHaveLength(studentLength);
        expect(res.body.waitingroom).toHaveLength(waitingRoomLength + 1);
    })

    it ("patch klasLeerling", async () => {
        const patch = await request(index)
            .patch(`/classes/${classId}/students/3`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(patch.status).toBe(200);
    });

    it ("check new klasLeerlingen", async () => {
        const res = await request(index)
            .get(`/classes/${classId}/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(200);
        expect(res.body.students).toHaveLength(studentLength + 1);
        expect(res.body.waitingroom).toHaveLength(waitingRoomLength);
    })

    it ("delete klasLeerling", async () => {
        const del = await request(index)
            .delete(`/classes/${classId}/students/3`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(del.status).toBe(200);
    })

    it ("check deleted klasLeerling", async () => {
        const res = await request(index)
            .get(`/classes/${classId}/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(200);
        expect(res.body.students).toHaveLength(studentLength);
        expect(res.body.waitingroom).toHaveLength(waitingRoomLength);
    })
});

//
// describe("klasLeerlingen", () => {
//     it("moet een lege lijst teruggeven als er geen students in de klas aanwezig zijn", async () => {
//         const classId: number = 4;
//
//                 const res = await request(index)
//             .get(`/classes/${classId}/students`)
//             .set("Authorization", `Bearer ${authToken.trim()}`);
//
//                 expect(res.status).toBe(200);
//         expect(res.body.students).toHaveLength(0);
//         expect(res.body).toEqual({
//             students: [],
//         });
//     });
//
//     it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
//                 const res = await request(index)
//             .get("/classes/abc/students")
//             .set("Authorization", `Bearer ${authToken.trim()}`);
//
//                 expect(res.status).toBe(400);
//         expect(res.body).toEqual({error: "invalid classId"});
//     });
// });
//
//
//
// describe("klasLeerlingToevoegen", () => {
//     it("moet statuscode 200 teruggeven bij het toevoegen van een student aan een klas", async () => {
//         const classId: number = 4;
//         const studentData = {student: "/students/3"};
//
//         const post = await request(index)
//             .post(`/classes/${classId}/students`)
//             .send(studentData)
//             .set("Authorization", `Bearer ${authToken.trim()}`);
//
//         expect(post.status).toBe(200);
//
//         const get = await request(index)
//             .get(`/classes/${classId}/students`)
//             .set("Authorization", `Bearer ${authToken.trim()}`);
//
//         expect(get.body).toEqual({
//             students: [
//                 `/students/1`,
//                 `/students/2`,],
//         });
//
//         const patch = await request(index)
//             .patch(`/classes/${classId}/students/3`)
//             .set("Authorization", `Bearer ${authToken.trim()}`);
//
//         expect(patch.status).toBe(200);
//
//         const get2 = await request(index)
//             .get(`/classes/${classId}/students`)
//             .set("Authorization", `Bearer ${authToken.trim()}`);
//
//         expect(get2.body).toEqual({
//             students: [
//                 `/students/1`,
//                 `/students/2`,
//                 `/students/3`,],
//         });
//     });
//
//     it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
//         const studentData = {student: "/students/3"};
//
//                 const res = await request(index)
//             .post("/classes/abc/students")
//             .send(studentData)
//             .set("Authorization", `Bearer ${authToken.trim()}`);
//
//                 expect(res.status).toBe(400);
//         expect(res.body).toEqual({error: "invalid classId"});
//     });
//
//     it("moet statuscode 400 terug geven bij een ongeldige student url", async () => {
//         const classId: number = 1;
//         const studentData = {student: "/students/abc"};
//
//                 const res = await request(index)
//             .post(`/classes/${classId}/students`)
//             .send(studentData)
//             .set("Authorization", `Bearer ${authToken.trim()}`);
//
//                 expect(res.status).toBe(400);
//         expect(res.body).toEqual({error: "wrong body"});
//     });
// });
//
//
//
// describe("klasLeerlingVerwijderen", () => {
//     it("moet statuscode 200 teruggeven bij het succesvol verwijderen van een student uit een klas", async () => {
//         const classId: number = 1;
//         const studentId: number = 1;
//
//                 const res = await request(index)
//             .delete(`/classes/${classId}/students/${studentId}`)
//             .set("Authorization", `Bearer ${authToken.trim()}`);
//
//                 expect(res.status).toBe(200);
//     });
//
//     it("moet statuscode 404 teruggeven bij het niet terugvinden van de student in een klas", async () => {
//         const classId: number = 1;
//         const studentId: number = 3;
//
//                 const res = await request(index)
//             .delete(`/classes/${classId}/students/${studentId}`)
//             .set("Authorization", `Bearer ${authToken.trim()}`);
//
//                 expect(res.status).toBe(404);
//         expect(res.body).toEqual({
//             error: `student not found`,
//         });
//     });
//
//     it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
//                 const res = await request(index)
//             .delete("/classes/abc/students/123")
//             .set("Authorization", `Bearer ${authToken.trim()}`);
//
//                 expect(res.status).toBe(400);
//         expect(res.body).toEqual({error: "invalid classId"});
//     });
//
//     it("moet statuscode 400 terug geven bij een ongeldig studentId", async () => {
//         const classId: number = 1;
//
//                 const res = await request(index)
//             .delete(`/classes/${classId}/students/abc`)
//             .set("Authorization", `Bearer ${authToken.trim()}`);
//
//                 expect(res.status).toBe(400);
//         expect(res.body).toEqual({error: "invalid studentId"});
//     });
// });