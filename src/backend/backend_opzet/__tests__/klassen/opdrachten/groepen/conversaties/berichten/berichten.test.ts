import request from "supertest";
import {beforeAll, describe, expect, it, vi} from "vitest";
import index from '../../../../../../index.ts';
import {PrismaClient} from "@prisma/client";
import { title } from "process";
const prisma = new PrismaClient();

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

    console.log('respnse body: ', response.body);

    authToken = response.body.token;
});


// GET /klassen/{klas_id}/opdrachten/{opdracht_id}/groepen/{groep_id}/conversaties/{conversatie_id}/berichten
describe("conversatieBerichten", () => {
  it("moet een lijst van berichten teruggeven met statuscode 200", async () => {
    const klasId: number = 123;
    const opdrachtId: number = 123;
    const groepId: number = 123;
    const conversatieId: number = 123;
    const leerlingId: number = 123;


        // maak klas aan
        const postClassroom = await request(index).post(`/klassen/${klasId}`);

        // verstuur het GET request
        const getClassroom = await request(index).get(`/klassen/${klasId}/opdrachten/${opdrachtId}/groepen/${groepId}/conversaties/${conversatieId}/berichten`);
        
        // controlleer de response
        expect(getClassroom.status).toBe(200);
        expect(getClassroom.body.conversaties).toHaveLength(1);
        expect(getClassroom.body).toEqual({
            berichten: [
                {
                    inhoud: "test",
                    zender: `leerlingen/${leerlingId}`
                }
            ]
        });
    });

  it("moet een lege lijst teruggeven als er geen berichten voor de conversatie zijn", async () => {
    const klasId: number = 234;
    const groepId: number = 234;
    const opdrachtId: number = 234;
    const conversatieId: number = 234;

    // verstuur het GET request
    const response = await request(index).get(
      `/klassen/${klasId}/opdrachten/${opdrachtId}/groepen/${groepId}/conversaties/${conversatieId}/berichten`
    );

    // controlleer de response
    expect(response.status).toBe(200);
    expect(response.body.leerlingen).toHaveLength(0);
    expect(response.body).toEqual({
      berichten: [],
    });
  });

  it("moet statuscode 400 terug geven bij een ongeldig klasId", async () => {
    const opdrachtId: number = 123;
    const groepId: number = 123;
    const conversatieId: number = 123;

    // verstuur het GET request
    const response = await request(index).get(
      `/klassen/abc/opdrachten/${opdrachtId}/groepen/${groepId}/conversaties/${conversatieId}/berichten`
    );

    // controlleer de response
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("invalid classId");
  });

  it("moet statuscode 400 terug geven bij een ongeldig opdrachtId", async () => {
    const klasId: number = 123;
    const groepId: number = 123;
    const conversatieId: number = 123;

    // verstuur het GET request
    const response = await request(index).get(
      `/klassen/${klasId}/opdrachten/abc/groepen/${groepId}/conversaties/${conversatieId}/berichten`
    );

    // controlleer de response
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("invalid assignmentId");
  });

  it("moet statuscode 400 terug geven bij een ongeldig groepId", async () => {
    const klasId: number = 123;
    const opdrachtId: number = 123;
    const conversatieId: number = 123;

    // verstuur het GET request
    const response = await request(index).get(
      `/klassen/${klasId}/opdrachten/${opdrachtId}/groepen/abc/conversaties/${conversatieId}/berichten`
    );

    // controlleer de response
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("invalid groupId");
  });

  it("moet statuscode 400 terug geven bij een ongeldig conversatieId", async () => {
    const klasId: number = 123;
    const opdrachtId: number = 123;
    const groepId: number = 123;

    // verstuur het GET request
    const response = await request(index).get(
      `/klassen/${klasId}/opdrachten/${opdrachtId}/groepen/${groepId}/conversaties/abc/berichten`
    );

    // controlleer de response
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("invalid conversationId");
  });

  it("moet statuscode 500 teruggeven bij een interne fout", async () => {
    const klasId: number = 123;
    const opdrachtId: number = 123;
    const groepId: number = 123;
    const conversatieId: number = 123;

    // simuleer een interne fout door de prisma methode te mocken
    vi.spyOn(prisma.classStudent, "findMany").mockRejectedValueOnce(
      new Error("Internal Error")
    );

    // verstuur het GET request
    const response = await request(index).get(
      `/klassen/${klasId}/opdrachten/${opdrachtId}/groepen/${groepId}/conversaties/${conversatieId}/berichten`
    );

    // controlleer de response
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "interne fout" });
  });
});

// POST /klassen/{klas_id}/opdrachten/{opdracht_id}/groepen/{groep_id}/conversaties/{conversatie_id}/berichten
describe("stuurInConversatie", () => {
  it("moet statuscode 200 teruggeven als een message aan een conversatie toegevoegd wordt", async () => {
    const klasId: number = 123;
    const opdrachtId: number = 123;
    const groepId: number = 123;
    const conversatieId: number = 123;
    const body = { bericht: "test", zender: "leerlingen/123" }; // TODO

    // verstuur het POST request
    const response = await request(index)
      .post(
        `/klassen/${klasId}/opdrachten/${opdrachtId}/groepen/${groepId}/conversaties/${conversatieId}/berichten`
      )
      .send(body);

    // controlleer de response
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      conversatie: `/klassen/${klasId}/opdrachten/${opdrachtId}/groepen/${groepId}/conversaties/${conversatieId}`,
    });
  });

  it("moet statuscode 400 terug geven bij een ongeldig klasId", async () => {
    const opdrachtId: number = 123;
    const groepId: number = 123;
    const conversatieId: number = 123;
    const body = { bericht: "test", zender: "leerlingen/123" }; // TODO

    // verstuur het POST request
    const response = await request(index)
      .post(
        `/klassen/abc/opdrachten/${opdrachtId}/groepen/${groepId}/conversaties/${conversatieId}/berichten`
      )
      .send(body);

    // controlleer de response
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("invalid classId");
  });

  it("moet statuscode 400 terug geven bij een ongeldig opdrachtId", async () => {
    const klasId: number = 123;
    const groepId: number = 123;
    const conversatieId: number = 123;
    const body = { bericht: "test", zender: "leerlingen/123" }; // TODO

    // verstuur het POST request
    const response = await request(index)
      .post(
        `/klassen/${klasId}/opdrachten/abc/groepen/${groepId}/conversaties/${conversatieId}/berichten`
      )
      .send(body);

    // controlleer de response
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("invalid assignmentId");
  });

  it("moet statuscode 400 terug geven bij een ongeldig groepId", async () => {
    const klasId: number = 123;
    const opdrachtId: number = 123;
    const conversatieId: number = 123;
    const body = { bericht: "test", zender: "leerlingen/123" }; // TODO

    // verstuur het POST request
    const response = await request(index)
      .post(
        `/klassen/${klasId}/opdrachten/${opdrachtId}/groepen/abc/conversaties/${conversatieId}/berichten`
      )
      .send(body);

    // controlleer de response
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("invalid groupId");
  });

  it("moet statuscode 400 terug geven bij een ongeldig conversatieId", async () => {
    const klasId: number = 123;
    const opdrachtId: number = 123;
    const groepId: number = 123;
    const body = { bericht: "test", zender: "leerlingen/123" }; // TODO

    // verstuur het POST request
    const response = await request(index)
      .post(
        `/klassen/${klasId}/opdrachten/${opdrachtId}/groepen/${groepId}/conversaties/abc/berichten`
      )
      .send(body);

    // controlleer de response
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("invalid conversationId");
  });

  it("moet statuscode 400 terug geven bij een ongeldig leerobject url in de body", async () => {
    const klasId: number = 123;
    const opdrachtId: number = 123;
    const groepId: number = 123;
    const conversatieId: number = 123;
    const body = { bericht: "test", zender: "leerlingen/ab" }; // TODO

    // verstuur het POST request
    const response = await request(index)
      .post(
        `/klassen/${klasId}/opdrachten/${opdrachtId}/groepen/${groepId}/conversaties/${conversatieId}/berichten`
      )
      .send(body);

    // controlleer de response
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "invalid sender url: should be /leerlingen/{id} or /leerkrachten/{id}"
    );
  });

  it("moet statuscode 500 teruggeven bij een interne fout", async () => {
    const klasId: number = 123;
    const opdrachtId: number = 123;
    const groepId: number = 123;
    const conversatieId: number = 123;
    const body = { bericht: "test", zender: "leerlingen/123" }; // TODO

    // simuleer een interne fout door de prisma methode te mocken
    vi.spyOn(prisma.classStudent, "create").mockRejectedValueOnce(
      new Error("Internal Error")
    );

    // verstuur het GET request
    const response = await request(index)
      .post(
        `/klassen/${klasId}/opdrachten/${opdrachtId}/groepen/${groepId}/conversaties/${conversatieId}/berichten`
      )
      .send(body);

    // controlleer de response
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "interne fout" });
  });
});
