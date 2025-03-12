import {NextFunction, Request, Response} from "express";
import { website_base } from "../../../index.ts";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import {ExpressException} from "../../../exceptions/ExpressException.ts";

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
      select: {
        id: true,
      },
    });

    let assignmentLinks = assignments.map(
      (assignment) =>
        website_base + `/klassen/${klas_id}/opdrachten/` + assignment.id
    );

    // const conversationLinks = conversations.map((conversatie) =>
    //     website_base + `/klassen/${classId.data}/opdrachten/${assignmentId.data}/groepen/${conversatie.group}/conversaties/${conversatie.id}`
    // );
    res.status(200).send({'opdrachten' : assignmentLinks});
  } catch (e) {
    res.status(500).send({ error: "internal server error ${e}" });
  }
}


const postKlasOpdrachtSchema = z.object({
  name: z.string(),
  deadline: z.coerce.date(),
  learning_path: z.string(),
});


// POST /klassen/{klas_id}/opdrachten
export async function maak_opdracht(req: Request, res: Response, next: NextFunction) {

  let klas_id = z.coerce.number().safeParse(req.params.klas_id);
  if (!klas_id.success) {throw new ExpressException(400, "invalid klas_id", next);}

  const parsedData = postKlasOpdrachtSchema.safeParse(req.body);
  if (!parsedData.success) {throw new ExpressException(400, "Invalid body", next);}

  let {learning_path, deadline, name} = parsedData.data;

  let leerpad_uuid = learning_path.split("/").pop()
  console.log(leerpad_uuid)
  if (leerpad_uuid == null) { throw new ExpressException(400, "leerpad_uuid invalid", next); }

  const klas = await prisma.class.findUnique({
    where: {
      id: klas_id.data,
    },
  });

  if (klas === null) {
    throw new ExpressException(400, `class with classId: ${klas_id.data} does not exist`, next);
  }

  console.log(klas);
  const opdracht = await prisma.assignment.create({
    data: {
      name: name,
      learning_path: leerpad_uuid,
      class: klas_id.data,
      created_at: new Date(),
      deadline: new Date(deadline),
    },
  });
  console.log("CREATED", opdracht);
  res.status(200).send({opdracht: website_base + `/klassen/${klas_id.data}/opdrachten/${opdracht.id}`});
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
