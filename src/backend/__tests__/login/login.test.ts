import request, { Response } from "supertest";
import { afterEach, describe, expect, it } from "vitest";
import index from "../../index.ts";

const testStudent = {
  username: "student_one",
  email: "student1@example.com",
  password: "test",
};

const testTeacher = {
  username: "teacher_one",
  email: "teacher1@example.com",
  password: "test",
};

let studentToken = "";
let teacherToken = "";
let studentId = "";
let teacherId = "";

describe("Authentication - Login Tests", () => {
  it("should fail to log in with a non-existent student", async () => {
    const student = {
      email: "nonexistent.student@ugent.be",
      password: "randompassword",
    };
    const res: Response = await request(index)
      .post("/authentication/login?usertype=student")
      .send(student);

    expect(res.status).toBe(404);
    // expect(res.body.message).toBe("user not found");
  });

  it("should fail to log in with a non-existent teacher", async () => {
    const teacher = {
      email: "nonexistent.teacher@ugent.be",
      password: "randompassword",
    };
    const res: Response = await request(index)
      .post("/authentication/login?usertype=teacher")
      .send(teacher);

    expect(res.status).toBe(404);
    //expect(res.body.message).toBe("user not found");
  });

  it("should successfully log in as a student", async () => {
    const res: Response = await request(index)
      .post("/authentication/login?usertype=student")
      .send(testStudent);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    studentToken = res.body.token;
    studentId = res.body.user;

    expect(typeof studentToken).toBe("string");
  });

  it("should successfully log in as a teacher", async () => {
    const res: Response = await request(index)
      .post("/authentication/login?usertype=teacher")
      .send(testTeacher);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    teacherToken = res.body.token;
    teacherId = res.body.user;

    expect(typeof teacherToken).toBe("string");
  });

  it("should fail to log in with incorrect student password", async () => {
    const student = {
      email: "student1@example.com",
      password: "wrongpassword",
    };
    const res: Response = await request(index)
      .post("/authentication/login?usertype=student")
      .send(student);

    expect(res.status).toBe(401);
    //expect(res.body.message).toBe("wrong password");
  });

  it("should fail to log in with incorrect teacher password", async () => {
    const teacher = {
      email: "teacher1@example.com",
      password: "wrongpassword",
    };
    const res: Response = await request(index)
      .post("/authentication/login?usertype=teacher")
      .send(teacher);

    expect(res.status).toBe(401);
    //expect(res.body.message).toBe("wrong password");
  });

  it("should fail to log in with empty password", async () => {
    const res: Response = await request(index)
      .post("/authentication/login?usertype=student")
      .send({ email: "student1@example.com", password: "" });

    expect(res.status).toBe(401); // TODO: check if this should be 400
    //expect(res.body.message).toBe("invalid password");
  });

  it("should fail to log in with empty email", async () => {
    const res: Response = await request(index)
      .post("/authentication/login?usertype=student")
      .send({ email: "", password: "test" });

    expect(res.status).toBe(400);
    //expect(res.body.message).toBe("invalid email");
  });

  it("should fail to log in with missing fields", async () => {
    const res: Response = await request(index)
      .post("/authentication/login?usertype=student")
      .send({});

    expect(res.status).toBe(400);
    //expect(res.body.message).toBe("invalid email");
  });

  it("should fail to log in with an invalid usertype", async () => {
    const res: Response = await request(index)
      .post("/authentication/login?usertype=admin")
      .send({ email: "student1@example.com", password: "test" });

    expect(res.status).toBe(400);
    //expect(res.body.message).toBe("invlid usertype");
  });

  afterEach(async () => {
    if (studentId) {
      await request(index)
        .delete(`/users/${studentId}`)
        .set("Authorization", `Bearer ${studentToken}`);
    }
    if (teacherId) {
      await request(index)
        .delete(`/users/${teacherId}`)
        .set("Authorization", `Bearer ${teacherToken}`);
    }
  });
});
