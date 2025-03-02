import {Request, Response} from "express";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

// GET /klassen/{klas_id}/opdrachten/{opdracht_id}/conversaties
export async function opdrachtConversaties(req: Request, res: Response) {
    try {
        //todo: auth
        let klasId: number = Number(req.params.klas_id);
        let opdrachtId: number = Number(req.params.opdracht_id);

        // controlleer de ids
        if (isNaN(klasId)) {
            res.status(400).send({error: "geen geldig klasId"});
            return;
        }
        if (isNaN(opdrachtId)) {
            res.status(400).send({error: "geen geldig opdrachtId"});
            return;
        }

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
