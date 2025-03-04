import {Request, Response} from "express";
import {PrismaClient} from "@prisma/client";
import { z } from "zod";
import { klas } from "../../../klassen_controller";

const prisma = new PrismaClient();

// zod validatie schemas
const getConversatiesSchema = z.object({
    klas_id: z.string().trim().regex(/^\d+$/, "geen geldig klasId"),
    opdracht_id: z.string().trim().regex(/^\d+$/, "geen geldig opdrachtId"),
    groep_id: z.string().trim().regex(/^\d+$/, "geen geldig groepId"),
});

const getConversatieSchema = z.object({
    klas_id: z.string().trim().regex(/^\d+$/, "geen geldig klasId"),
    opdracht_id: z.string().trim().regex(/^\d+$/, "geen geldig opdrachtId"),
    groep_id: z.string().trim().regex(/^\d+$/, "geen geldig groepId"),
    conversatie_id: z.string().trim().regex(/^\d+$/, "geen geldig conversatieId"),
});

const bodyConversatieSchema = z.object({
    titel: z.string(),
    leerobject: z.string().trim().regex(/^\/leerobjecten\/[a-zA-Z0-9-]+$/, "geen geldige url, format: /leerobjecten/{id}")
});


// GET /klassen/{klas_id}/opdrachten/{opdracht_id}/groepen/{groep_id}/conversaties
export async function groepConversaties(req: Request, res: Response) {
    try {
        //todo: auth

        // controleer de ids
        const parseResult = getConversatiesSchema.safeParse(req.params);

        if (!parseResult.success) {
            res.status(400).send({
                error: "fout geformateerde link",
                details: parseResult.error.errors
            });
            return;
        }

        const klasId: number = Number(parseResult.data.klas_id);
        const opdrachtId: number = Number(parseResult.data.opdracht_id);
        const groepId: number = Number(parseResult.data.groep_id);

        // alle conversaties over een opdracht van een groep opvragen
        const conversaties = await prisma.conversation.findMany({
            where: {
                assignment: opdrachtId,
                group: groepId
            },
            select: {
                id: true,
            }
        });

        const resultaten = conversaties.map((conversatie) => 
            `/klassen/${klasId}/opdrachten/${opdrachtId}/groepen/${groepId}/conversaties/${conversatie.id}`
        );

        res.status(200).send({conversaties: resultaten});
    } catch (e) {
        res.status(500).send({error: "interne fout"});
    }
}

// POST /klassen/{klas_id}/opdrachten/{opdracht_id}/groepen/{groep_id}/conversaties
export async function groepMaakConversatie(req: Request, res: Response) {
    try {
        //todo: auth

        // controleer de ids
        const paramsResult = getConversatiesSchema.safeParse(req.params);
        const bodyResult = bodyConversatieSchema.safeParse(req.body);

        if (!paramsResult.success) {
            res.status(400).send({
                error: "fout geformateerde link",
                details: paramsResult.error.errors
            });
            return;
        }

        if (!bodyResult.success) {
            res.status(400).send({
                error: "foute body",
                details: bodyResult.error.errors
            });
            return;
        }

        const klasId: number = Number(paramsResult.data.klas_id);
        const opdrachtId: number = Number(paramsResult.data.opdracht_id);
        const groepId: number = Number(paramsResult.data.groep_id);

        const titel: string = bodyResult.data.titel;
        const leerobjectUrl: string = bodyResult.data.leerobject;
        const match = leerobjectUrl.match(/^\/leerobjecten\/([a-zA-Z0-9-]+)$/);
        const leerobjectId: string = match![1];

        // leerobject opvragen om de uuid te krijgen
        const leerObject = await prisma.learningObject.findUnique({
            where: {
                id: leerobjectId
            },
            select: {
                uuid: true 
            }
        });

        if (!leerObject) {
            res.status(404).send({ error: "leerobject niet gevonden" });
            return;
        }
        
        // opvragen van de leerkrachten die op de conversatie kunnen antwoorden
        const leerkrachten = await prisma.classTeacher.findMany({
            where: { classes_id: klasId },
            select: { teachers_id: true }
        });

        if (!leerkrachten) {
            res.status(404).send({ error: "Geen leerkracht gevonden voor deze klas" });
            return;
        }

        const leerkrachtenIds = leerkrachten.map((leerkracht) => leerkracht.teachers_id);

        // voeg conversatie over een opdracht van een groep toe, gegeven titel
        const conversatie = await prisma.conversation.create({
            data: {
                title: titel,
                learning_object: leerObject.uuid,
                teachers: leerkrachtenIds,
                group: groepId,
                assignment: opdrachtId,
            }
        });

        res.status(200).send({conversatie: `/klassen/${klasId}/opdrachten/${opdrachtId}/groepen/${groepId}/conversaties/${conversatie.id}`});
    } catch (e) {
        res.status(500).send({error: "interne fout"});
    }
}

// GET /klassen/{klas_id}/opdrachten/{opdracht_id}/groepen/{groep_id}/conversaties/{conversatie_id}
export async function conversatie(req: Request, res: Response) {
    try {
        //todo: auth

        // controleer de ids
        const parseResult = getConversatieSchema.safeParse(req.params);

        if (!parseResult.success) {
            res.status(400).send({
                error: "fout geformateerde link",
                details: parseResult.error.errors
            });
            return;
        }

        const klasId: number = Number(parseResult.data.klas_id);
        const opdrachtId: number = Number(parseResult.data.opdracht_id);
        const groepId: number = Number(parseResult.data.groep_id);
        const conversatieId: number = Number(parseResult.data.conversatie_id);

        // één conversatie over een opdracht van een groep opvragen
        const conversatie = await prisma.conversation.findFirst({
            where: {
                id: conversatieId,
                assignment: opdrachtId,
                group: groepId
            }
        });

        if(!conversatie) {
            res.status(400).send({error: `conversatie ${conversatieId} niet gevonden`});
            return;
        }

        res.status(200).send({
            title: conversatie.title,
            groep: conversatie.group,
            berichten: `/klassen/${klasId}/opdrachten/${opdrachtId}/groepen/${groepId}/conversaties/${conversatieId}/berichten`
        });
    } catch (e) {
        res.status(500).send({error: "interne fout"});
    }
}

// DELETE /klassen/{klas_id}/opdrachten/{opdracht_id}/groepen/{groep_id}/conversaties/{conversatie_id}
export async function verwijderConversatie(req: Request, res: Response) {
    try {
        //todo: auth

        // controleer de ids
        const paramsResult = getConversatieSchema.safeParse(req.params);

        if (!paramsResult.success) {
            res.status(400).send({
                error: "fout geformateerde link",
                details: paramsResult.error.errors
            });
            return;
        }

        const opdrachtId: number = Number(paramsResult.data.opdracht_id);
        const groepId: number = Number(paramsResult.data.groep_id);
        const conversatieId: number = Number(paramsResult.data.groep_id);

        // verwijder een conversatie over een opdracht van een groep
        await prisma.conversation.delete({
            where: {
                id: conversatieId,
                assignment: opdrachtId,
                group: groepId
            }
        });
        res.status(200);

    } catch (e) {
        res.status(500).send({error: "interne fout"});
    }
}
