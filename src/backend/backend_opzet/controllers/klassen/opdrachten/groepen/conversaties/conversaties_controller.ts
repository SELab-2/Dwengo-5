import {Request, Response} from "express";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

// GET /klassen/{klas_id}/opdrachten/{opdracht_id}/groepen/{groep_id}/conversaties
export async function groepConversaties(req: Request, res: Response) {
    try {
        //todo: auth
        let klasId: number = Number(req.params.klas_id);
        let opdrachtId: number = Number(req.params.opdracht_id);
        let groepId: number = Number(req.params.groep_id);

        // controlleer de ids
        if (isNaN(klasId)) {
            res.status(400).send({error: "geen geldig klasId"});
            return;
        }
        if (isNaN(opdrachtId)) {
            res.status(400).send({error: "geen geldig opdrachtId"});
            return;
        }
        if (isNaN(groepId)) {
            res.status(400).send({error: "geen geldig groepId"});
            return;
        }

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

export async function groepMaakConversatie(req: Request, res: Response) {
    res.status(501);
}

export async function conversatie(req: Request, res: Response) {
    res.status(501);
}

export async function verwijderConversatie(req: Request, res: Response) {
    res.status(501);
}
