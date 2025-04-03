import request from "supertest";
import {beforeAll, describe, expect, expectTypeOf, it} from "vitest";
import index from "../../../../index.ts";


let authToken: string;
let classURL: string;
let userURL: string;

const getStudentClasses = async (user: string) => {
    return request(index)
        .get(`${user}/classes`)
        .set("Authorization", `Bearer ${authToken.trim()}`);
};

beforeAll(async () => {
    // Perform login as student1
    const loginPayload = {
        email: 'student1@example.com',
        password: 'test'
    };

    const res = await request(index).post("/authentication/login?usertype=student").send(loginPayload);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");

    authToken = res.body.token;
    userURL = res.body.user;

    const classes = (await getStudentClasses(userURL)).body;
    classURL = classes.classes[0]; // neem eerste klas van student
});

describe("students/:studentId/classes/:classId/assignments", () => {
    it("krijg lijst van assignments", async () => { //fails
        console.log(`${userURL}${classURL}/assignments`);
        let res = await request(index).get(`${userURL}${classURL}/assignments`).set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(200);
        console.log(res.body.assignments);
        expectTypeOf(res.body.classes).toEqualTypeOf({x: []});
        //expect(res.body.assignments[0]).toBe("/classes/1/assignments/5");
        //expect(res.body.assignments).toHaveLength(1)
    });

    it("no authoriazation because of invalid Id", async () => {
        let res = await request(index).get("/students/xxxx/classes/1/assignments").set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
    });

    it("class not found", async () => { // fails
        let res = await request(index).get("/students/1/classes/50/assignments").set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(404);
    });

    it("invalid class Id", async () => { // fails
        let res = await request(index).get("/students/1/classes/hhhhhh/assignments").set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
    });
});