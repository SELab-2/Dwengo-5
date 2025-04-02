import request from "supertest";
import { beforeAll, describe, expect, expectTypeOf, it } from "vitest";
import index from "../../../index.ts";

let authToken: string;
let userURL: string;

async function loginAsStudent() {
    const loginPayload = { email: 'student1@example.com', password: 'test' };
    const res = await request(index).post("/authentication/login?usertype=student").send(loginPayload);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    authToken = res.body.token;
    userURL = res.body.user;
}

beforeAll(async () => {
    await loginAsStudent();
});

const getStudentClasses = async (user: string) => {
    return request(index)
        .get(`${user}/classes`)
        .set("Authorization", `Bearer ${authToken.trim()}`);
};

describe("studentKlassen", () => {
    it("should return a list of classes for a valid student ID", async () => {
        const res = await getStudentClasses(userURL);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("classes");
        expectTypeOf(res.body.classes).toEqualTypeOf({x: []});
        console.log(res.body.classes);
        //expect(res.body).toEqual({ classes: ["/classes/1", "/classes/2", "/classes/3"] }); TODO: make sure that student1 doesn't join other classes in order to check properly
    });

    it("should return a 400 status for an invalid student ID", async () => {
        const res = await getStudentClasses("/students/aaaa");
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: "invalid userId" });
    });
});