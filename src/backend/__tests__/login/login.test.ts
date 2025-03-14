import request, { Response } from "supertest";
import { describe, expect, it, afterEach } from "vitest";
import index from '../../index.ts';

const testStudent = { username: "testStudent", email: "testStudent@test.be", password: "SafePassword123", activeLang: "en" };
const testTeacher = { username: "testTeacher", email: "testTeacher@test.be", password: "StrongPassword123", activeLang: "en" };

let studentToken = "";
let teacherToken = "";
let studentId = "";
let teacherId = "";


describe("log in", () => {
  it("logging in fails on non-existent student", async () => {
    const leerling: any = {
      username: "Quintinius Hoedtius (doesn't exist)",
      email: "Quintinius.Hoedtius@ugent.be",
      password: "wachtw00rd",
      activeLang: "nl"
    };
    let res: Response = await request(index)
      .post("/authenticatie/aanmelden?gebruikerstype=leerling")
      .send(leerling);
    expect(res.status).toBe(401);
  });

  it("logging in fails on non-existent teacher", async () => {
    const leerkracht: any = {
      usename: "Roberto Saulo",
      email: "Roberto.Saulo@ugent.be",
      password: "knuffelmuis123",
      activeLang: "en"
    };
    let res: Response = await request(index)
      .post("/authenticatie/aanmelden?gebruikerstype=leerkracht")
      .send(leerkracht);
    expect(res.status).toBe(401);
  });
});

describe("log in - extra tests", () => {
  afterEach(async () => {
    if (studentId) {
      await request(index)
        .del(studentId)
        .set("Authorization", `Bearer ${studentToken}`);
    }
    if (teacherId) {
      await request(index)
        .del(teacherId)
        .set("Authorization", `Bearer ${teacherToken}`);
    }
  });

  it("successfully and wrongfully log in as student", async () => {
    let res1: Response = await request(index).post("/authenticatie/registreren?gebruikerstype=leerling").send(testStudent);
    expect(res1.status).toBe(200);
    const testWrongStudent = { username: "testStudent", email: "testStudent@test.be", password: "WrongPassword123", activeLang: "en" };
    let res2: Response = await request(index)
      .post("/authenticatie/aanmelden?gebruikerstype=leerling")
      .send(testWrongStudent);
    expect(res2.status).toBe(401);
    let res3: Response = await request(index)
      .post("/authenticatie/aanmelden?gebruikerstype=leerling")
      .send(testStudent);
    expect(res3.status).toBe(200);
    expect(res3.body).toHaveProperty("token");
    studentToken = res3.body.token;
    studentId = res3.body.id;
  });

  it("successfully and wrongfully log in as teacher", async () => {
    await request(index).post("/authenticatie/registreren?gebruikerstype=leerkracht").send(testTeacher);
    const testWrongTeacher = { username: "testTeacher", email: "testTeacher@test.be", password: "WrongPassword123", activeLang: "en" };
    let res1: Response = await request(index)
      .post("/authenticatie/aanmelden?gebruikerstype=leerkracht")
      .send(testWrongTeacher);
    expect(res1.status).toBe(401);
    let res2: Response = await request(index)
      .post("/authenticatie/aanmelden?gebruikerstype=leerkracht")
      .send(testTeacher);
    expect(res2.status).toBe(200);
    expect(res2.body).toHaveProperty("token");
    teacherToken = res2.body.token;
    teacherId = res2.body.id;
  });

  it("logging in fails with empty password", async () => {
    const leerling = { naam: "Test student", wachtwoord: "" };
    let res: Response = await request(index)
      .post("/authenticatie/aanmelden?gebruikerstype=leerling")
      .send(leerling);
    expect(res.status).toBe(400);
  });

  it("logging in fails with empty username", async () => {
    const leerling = { naam: "", wachtwoord: "SafePassword123" };
    let res: Response = await request(index)
      .post("/authenticatie/aanmelden?gebruikerstype=leerling")
      .send(leerling);
    expect(res.status).toBe(400);
  });

})
