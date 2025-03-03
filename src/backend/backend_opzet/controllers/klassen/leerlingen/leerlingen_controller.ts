import {Request, Response} from "express";
import {PrismaClient} from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// zod validatie schemas
const klasIdSchema = z.object({
    klas_id: z.string().trim().regex(/^\d+$/, "geen geldig klasId"),
});


const leerlingUrlSchema = z.object({
    leerling: z.string().trim().regex(/^\/leerlingen\/\d+$/, "geen geldige url, format: /leerlingen/{id}"),
});


const deleteLeerlingenSchema = z.object({
    klas_id: z.string().trim().regex(/^\d+$/, "geen geldig klasId"),
    leerling_id: z.string().trim().regex(/^\d+$/, "geen geldig leerlingId"),
});


// GET /klassen/{klas_id}/leerlingen
export async function klasLeerlingen(req: Request, res: Response) {
    try {
        //todo: auth

        // controleer het id
        const parseResult = klasIdSchema.safeParse(req.params);

        if (!parseResult.success) {
            res.status(400).send({
                error: "fout geformateerde link",
                details: parseResult.error.errors
            });
            return;
        }

        const klasId: number = Number(parseResult.data.klas_id);

        // alle leerlingen van een klas opvragen
        const leerlingen = await prisma.classStudent.findMany({
            where: {
                classes_id: klasId
            },
            select: { 
                students_id: true
            }
        });

        // leerlingen naar links mappen
        const resultaten = leerlingen.map((leerling) => {
            return `/leerlingen/${leerling.students_id}`
        });
        res.status(200).send({leerlingen: resultaten});

    } catch (e) {
        res.status(500).send({error: "interne fout"})
    }
}

// POST /klassen/{klas_id}/leerlingen
export async function klasLeerlingToevoegen(req: Request, res: Response) {
    try {
        //todo: auth

        // controleer de parameters/body
        const klasIdResult = klasIdSchema.safeParse(req.params);
        const leerlingUrlResult = leerlingUrlSchema.safeParse(req.body);

        if (!klasIdResult.success) {
            res.status(400).send({
                error: "fout geformateerde link",
                details: klasIdResult.error.errors
            });
            return;
        }

        if (!leerlingUrlResult.success) {
            res.status(400).send({
                error: "foute body",
                details: leerlingUrlResult.error.errors
            });
            return;
        }

        const klasId: number = Number(klasIdResult.data.klas_id);
        const leerlingUrl: string = leerlingUrlResult.data.leerling;
        const leerlingId: number = Number(leerlingUrl.split("/").pop());

        // voeg nieuwe leerling toe aan de klas
        await prisma.classStudent.create({
            data: {
                classes_id: klasId,
                students_id: leerlingId
            }
        });
        res.status(200);

    } catch (e) {
        res.status(500).send({error: "interne fout"})
    }
}

// DELETE /klassen/{klas_id}/leerlingen/{leerling_id}
export async function klasLeerlingVerwijderen(req: Request, res: Response) {
    try {
        //todo: auth

        // controleer het id
        const parseResult = deleteLeerlingenSchema.safeParse(req.params);

        if (!parseResult.success) {
            res.status(400).send({
                error: "fout geformateerde link",
                details: parseResult.error.errors
            });
            return;
        }

        const klasId: number = Number(parseResult.data.klas_id);
        const leerlingId: number = Number(parseResult.data.leerling_id);

        // controlleren of de leerling in de klas aanwezig is
        const leerling = await prisma.classStudent.findFirst({
            where: {
                classes_id: klasId,
                students_id: leerlingId
            }
        });

        if (!leerling) {
            res.status(404).send({error: `leerling ${leerlingId} niet gevonden in klas ${klasId}`});
            return;
        }

        // verwijder een leerling uit de klas
        await prisma.classStudent.delete({
            where: {
                classes_id_students_id: {
                    classes_id: klasId,
                    students_id: leerlingId
                }
            }
        });
        res.status(200);

    } catch (e) {
        res.status(500).send({error: "interne fout"})
    }
}