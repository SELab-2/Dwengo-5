import { Request, Response } from "express";
import { website_base } from "../../../index.ts";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(); //todo vervang dit later door export in index.ts

// GET: /klassen/{klas_id}/opdrachten
export async function klas_opdrachten(req: Request, res: Response) {
  try {
    //todo: auth
    let klas_id_string: string = req.params.klas_id;
    let klas_id: number = Number(klas_id_string);
    if (isNaN(klas_id)) {
      res.status(400).send({ error: "geen geldige klas_id" });
      return;
    }

    const klas = prisma.class.findUnique({
      where: {
        id: klas_id,
      },
    });

    if (klas === null) {
      res
        .status(400)
        .send({ error: "klas met klas_id ${klas_id} bestaat niet." });
      return;
    }

    const assignments = await prisma.assignment.findMany({
      where: {
        class: klas_id,
      },
    });

    const assignmentLinks = assignments.map(
      (assignment: { learning_path: string }) =>
        `/klassen/${klas_id}/opdrachten/${assignment.id}`
    );
    res.status(200).send({opdrachten:assignmentLinks});
  } catch (e) {
    res.status(500).send({ error: "internal server error ${e}" });
  }
}

// POST /klassen/{klas_id}/opdrachten
export async function maak_opdracht(req: Request, res: Response) {
  try {
    let klas_id_string: string = req.params.klas_id;
    let klas_id: number = Number(klas_id_string);
    let leerpad_id_string: string = req.body.leerpad_id;
    let leerpad_id: string = leerpad_id_string;

    if (isNaN(klas_id)) {
      res.status(400).send({ error: "geen geldige klas_id" });
      return;
    }

    const klas = prisma.class.findUnique({
      where: {
        id: klas_id,
      },
    });

    if (klas === null) {
      res
        .status(400)
        .send({ error: "klas met klas_id ${klas_id} bestaat niet." });
      return;
    }

    await prisma.assignment.create({
      data: {
        name: "opdracht", // todo: name uit req body halen
        learning_path: leerpad_id,
        class: klas_id,
        created_at: new Date(),
      },
    });
    res.status(200).send("connected assigment succesful");
  } catch (e) {
    res.status(501).send("error: ${e}");
  }
}

// GET /klassen/{klas_id}/opdrachten/{opdracht_id}
export async function klas_opdracht(req: Request, res: Response) {
  try {
    let klas_id_string: string = req.params.klas_id;
    let klas_id: number = Number(klas_id_string);
    if (isNaN(klas_id)) {
      res.status(400).send({ error: "geen geldige klas_id" });
      return;
    }

    const klas = prisma.class.findUnique({
      where: {
        id: klas_id,
      },
    });

    if (klas === null) {
      res
        .status(400)
        .send({ error: "klas met klas_id ${klas_id} bestaat niet." });
      return;
    }

    let opdracht_id_string: string = req.params.opdracht_id;
    let opdracht_id: number = Number(opdracht_id_string);

    if (isNaN(opdracht_id)) {
      res.status(400).send({ error: "geen geldige opdracht_id" });
      return;
    }

    const opdracht = prisma.assignment.findUnique({
      where: {
        id: opdracht_id,
        class: klas_id,
      },
      include: {
        learning_paths: true,
      },
    });

    const leerpad_link =
      website_base + "/leerpaden/{" + opdracht.learning_paths + "}";
    res.status(200).send(leerpad_link);
  } catch (e) {
    res.status(500).send({ error: "internal server error ${e}" });
  }
}
// DELETE /klassen/{klas_id}/opdrachten/{opdracht_id}
export async function verwijder_opdracht(req: Request, res: Response) {
  try {
    let klas_id_string: string = req.params.klas_id;
    let klas_id: number = Number(klas_id_string);
    if (isNaN(klas_id)) {
      res.status(400).send({ error: "geen geldige klas_id" });
      return;
    }

    const klas = prisma.class.findUnique({
      where: {
        id: klas_id,
      },
    });

    if (klas === null) {
      res
        .status(400)
        .send({ error: "klas met klas_id ${klas_id} bestaat niet." });
      return;
    }

    let opdracht_id_string: string = req.params.opdracht_id;
    let opdracht_id: number = Number(opdracht_id_string);

    if (isNaN(opdracht_id)) {
      res.status(400).send({ error: "geen geldige opdracht_id" });
      return;
    }

    await prisma.class.update({
      where: { id: klas_id },
      data: {
        assignments: {
          disconnect: { id: opdracht_id },
        },
      },
    });
    res.status(200);
  } catch (e) {
    res.status(500).send({ error: "internal server error ${e}" });
  }
}
