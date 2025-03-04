import {Request, Response} from "express";
import {PrismaClient} from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// zod validatie schema
const getConversatiesSchema = z.object({
    klas_id: z.string().trim().regex(/^\d+$/, "geen geldig klasId"),
    opdracht_id: z.string().trim().regex(/^\d+$/, "geen geldig opdrachtId"),
});


// GET /klassen/{klas_id}/opdrachten/{opdracht_id}/conversaties
export async function opdrachtConversaties(req: Request, res: Response) {
    try {
        //todo: auth

        // controleer het id
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

        // alle conversaties over een opdracht van een klas opvragen
        const conversaties = await prisma.conversation.findMany({
            where: {
                assignment: opdrachtId,
                groups: {
                    class: klasId,
                }
            },
            select: {
                id: true,
                group: true
            }
        });

        const resultaten = conversaties.map((conversatie) => 
            `/klassen/${klasId}/opdrachten/${opdrachtId}/groepen/${conversatie.group}/conversaties/${conversatie.id}`
        );

        res.status(200).send({conversaties: resultaten});
    } catch (e) {
        res.status(500).send({error: "interne fout"});
    }
}
