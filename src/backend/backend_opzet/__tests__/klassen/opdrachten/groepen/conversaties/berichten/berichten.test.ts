import request from "supertest";
import {beforeAll, describe, expect, it, vi} from "vitest";
import index, { website_base } from '../../../../../../index.ts';
import seedDatabase from '../../../../../../prisma/seedDatabase.ts';

vi.mock("../prismaClient", () => ({
  classStudent: {
    findMany: vi.fn(),
  },
}));

let authToken: string;

beforeAll(async () => {
    await seedDatabase();
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


// GET /klassen/:klas_id/opdrachten/:opdracht_id/groepen/:groep_id/conversaties/:conversatie_id/berichten
describe("conversatieBerichten", () => {
  it("moet een lijst van berichten teruggeven met statuscode 200", async () => {
    const classId: number = 1;
    const assignmentId: number = 1;
    const groupId: number = 1;
    const conversationId: number = 1;
    const studentId: number = 1;

    // verstuur het GET request
    const getClassroom = await request(index)
      .get(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/${groupId}/conversaties/${conversationId}/berichten`)
      .set("Authorization", `Bearer ${authToken.trim()}`); 
    
    // controlleer de response
    expect(getClassroom.status).toBe(200);
    expect(getClassroom.body.berichten).toHaveLength(1);
    expect(getClassroom.body).toEqual({
        berichten: [
            {
                inhoud: "I don't understand this part of the assignment",
                zender: `/leerlingen/${studentId}`
            }
        ]
    });
    });

  it("moet een lege lijst teruggeven als er geen berichten voor de conversatie zijn", async () => {
    const classId: number = 1;
    const assignmentId: number = 4;
    const groupId: number = 4;
    const conversationId: number = 3;

    // verstuur het GET request
    const response = await request(index)
      .get(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/${groupId}/conversaties/${conversationId}/berichten`)
      .set("Authorization", `Bearer ${authToken.trim()}`); 

    // controlleer de response
    expect(response.status).toBe(200);
    expect(response.body.berichten).toHaveLength(0);
    expect(response.body).toEqual({
      berichten: [],
    });
  });

  it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
    const assignmentId: number = 1;
    const groupId: number = 1;
    const conversationId: number = 1;

    // verstuur het GET request
    const response = await request(index)
      .get(`/klassen/abc/opdrachten/${assignmentId}/groepen/${groupId}/conversaties/${conversationId}/berichten`)
      .set("Authorization", `Bearer ${authToken.trim()}`);

    // controlleer de response
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("invalid classId");
  });

  it("moet statuscode 400 terug geven bij een ongeldig assignmentId", async () => {
    const classId: number = 1;
    const groupId: number = 1;
    const conversationId: number = 1;

    // verstuur het GET request
    const response = await request(index)
      .get(`/klassen/${classId}/opdrachten/abc/groepen/${groupId}/conversaties/${conversationId}/berichten`)
      .set("Authorization", `Bearer ${authToken.trim()}`);

    // controlleer de response
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("invalid assignmentId");
  });

  it("moet statuscode 400 terug geven bij een ongeldig groupId", async () => {
    const classId: number = 1;
    const assignmentId: number = 1;
    const conversationId: number = 1;

    // verstuur het GET request
    const response = await request(index)
      .get(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/abc/conversaties/${conversationId}/berichten`)
      .set("Authorization", `Bearer ${authToken.trim()}`);

    // controlleer de response
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("invalid groupId");
  });

  it("moet statuscode 400 terug geven bij een ongeldig conversationId", async () => {
    const classId: number = 1;
    const assignmentId: number = 1;
    const groupId: number = 1;

    // verstuur het GET request
    const response = await request(index)
      .get(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/${groupId}/conversaties/abc/berichten`)
      .set("Authorization", `Bearer ${authToken.trim()}`);

    // controlleer de response
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("invalid conversationId");
  });
});


// POST /klassen/:klas_id/opdrachten/:opdracht_id/groepen/:groep_id/conversaties/:conversatie_id/berichten
describe("stuurInConversatie", () => {
  it("moet statuscode 200 teruggeven als een message aan een conversatie toegevoegd wordt", async () => {
    const classId: number = 1;
    const assignmentId: number = 1;
    const groupId: number = 1;
    const conversationId: number = 1;
    const body = { bericht: "I don't understand this part of the assignment", zender: "/leerlingen/2" };

    // verstuur het POST request
    const response = await request(index)
      .post(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/${groupId}/conversaties/${conversationId}/berichten`)
      .send(body)
      .set("Authorization", `Bearer ${authToken.trim()}`);

    // controlleer de response
    expect(response.status).toBe(200);
  });

  it("moet statuscode 404 terug geven als de conversatie niet bestaat", async () => {
    const classId: number = 1;
    const assignmentId: number = 1;
    const groupId: number = 1;
    const conversationId: number = 3;
    const body = { bericht: "test", zender: "/leerlingen/2" };

    // verstuur het POST request
    const response = await request(index)
      .post(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/${groupId}/conversaties/${conversationId}/berichten`)
      .send(body)
      .set("Authorization", `Bearer ${authToken.trim()}`);

    // controlleer de response
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("conversation not found");
  });

  it("moet statuscode 400 terug geven als de groep niet bij de juiste klas hoort", async () => {
    const classId: number = 1;
    const assignmentId: number = 1;
    const groupId: number = 2;
    const conversationId: number = 3;
    const body = { bericht: "test", zender: "/leerlingen/2" };

    // verstuur het POST request
    const response = await request(index)
      .post(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/${groupId}/conversaties/${conversationId}/berichten`)
      .send(body)
      .set("Authorization", `Bearer ${authToken.trim()}`);

    // controlleer de response
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("group doesn't belong to this class");
  });

  it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
    const assignmentId: number = 1;
    const groupId: number = 1;
    const conversationId: number = 1;
    const body = { bericht: "test", zender: "leerlingen/2" };

    // verstuur het POST request
    const response = await request(index)
      .post(`/klassen/abc/opdrachten/${assignmentId}/groepen/${groupId}/conversaties/${conversationId}/berichten`)
      .send(body)
      .set("Authorization", `Bearer ${authToken.trim()}`);

    // controlleer de response
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("invalid classId");
  });

  it("moet statuscode 400 terug geven bij een ongeldig assignmentId", async () => {
    const classId: number = 1;
    const groupId: number = 1;
    const conversationId: number = 1;
    const body = { bericht: "test", zender: "leerlingen/2" };

    // verstuur het POST request
    const response = await request(index)
      .post(`/klassen/${classId}/opdrachten/abc/groepen/${groupId}/conversaties/${conversationId}/berichten`)
      .send(body)
      .set("Authorization", `Bearer ${authToken.trim()}`);

    // controlleer de response
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("invalid assignmentId");
  });

  it("moet statuscode 400 terug geven bij een ongeldig groupId", async () => {
    const classId: number = 1;
    const assignmentId: number = 1;
    const conversationId: number = 1;
    const body = { bericht: "test", zender: "leerlingen/2" };

    // verstuur het POST request
    const response = await request(index)
      .post(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/abc/conversaties/${conversationId}/berichten`)
      .send(body)
      .set("Authorization", `Bearer ${authToken.trim()}`);

    // controlleer de response
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("invalid groupId");
  });

  it("moet statuscode 400 terug geven bij een ongeldig conversationId", async () => {
    const classId: number = 1;
    const assignmentId: number = 1;
    const groupId: number = 1;
    const body = { bericht: "test", zender: "leerlingen/2" };

    // verstuur het POST request
    const response = await request(index)
      .post(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/${groupId}/conversaties/abc/berichten`)
      .send(body)
      .set("Authorization", `Bearer ${authToken.trim()}`);

    // controlleer de response
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("invalid conversationId");
  });

  it("moet statuscode 400 terug geven bij een ongeldig leerobject url in de body", async () => {
    const classId: number = 1;
    const assignmentId: number = 1;
    const groupId: number = 1;
    const conversationId: number = 1;
    const body = { bericht: "test", zender: "leerlingen/ab" };

    // verstuur het POST request
    const response = await request(index)
      .post(`/klassen/${classId}/opdrachten/${assignmentId}/groepen/${groupId}/conversaties/${conversationId}/berichten`)
      .send(body)
      .set("Authorization", `Bearer ${authToken.trim()}`);

    // controlleer de response
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "invalid sender url: should be /leerlingen/{id} or /leerkrachten/{id}"
    );
  });
});
