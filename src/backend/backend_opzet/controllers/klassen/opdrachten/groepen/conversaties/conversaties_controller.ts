import {Request, Response} from "express";
import {PrismaClient} from "@prisma/client";
import { z } from "zod";

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
    res.status(501);
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

export async function verwijderConversatie(req: Request, res: Response) {
    res.status(501);
}
