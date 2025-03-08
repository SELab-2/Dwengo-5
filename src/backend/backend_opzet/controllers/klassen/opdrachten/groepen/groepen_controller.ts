import {Request, Response} from "express";
import {PrismaClient} from '@prisma/client'
import {website_base} from "../../../../index.ts";

const prisma = new PrismaClient() //todo vervang dit later door export in index.ts


// GET /klassen/:klas_id/opdrachten/:opdracht_id/groepen
export async function opdracht_groepen(req: Request, res: Response) {
    try{
        let klas_id_string: string = req.params.klas_id;
        let klas_id: number = Number(klas_id_string);

        let opdracht_id_string: string = req.params.opdracht_id;
        let opdracht_id: number = Number(opdracht_id_string)
        if (isNaN(klas_id)) {
            res.status(400).send({error: "geen geldige klas_id"});
            return;
        }

        const opdracht = prisma.assignment.findUnique({
            where: {
                id: opdracht_id
            }
        })

        const klas = prisma.class.findUnique({
            where: {
                id: klas_id
            }
        })

        if(opdracht == null){
            res.status(400).send({error: "opdracht met opdracht_id ${opdracht_id} bestaat niet."});
            return;
        }

        if(klas === null){
            res.status(400).send({error: "klas met klas_id ${klas_id} bestaat niet."});
            return;
        }

        const groepen = await prisma.group.findMany({
            where: {
                class: klas_id,
                assignment: opdracht_id
            },
            select: {
                id: true
            }
        })

        let groepen_links = groepen.map((groep: { id: number; })=>website_base + "/groepen/{" + groep.id + "}");
        res.status(200).send(groepen_links);
    }catch(e){
        res.status(500).send({error: "internal server error ${e}"})
    }
}

// POST /klassen/:klas_id/opdrachten/:opdracht_id/groepen
export async function opdracht_maak_groep(req: Request, res: Response) {
    try{
        let klas_id_string: string = req.params.klas_id;
        let klas_id: number = Number(klas_id_string);

        let opdracht_id_string: string = req.params.opdracht_id;
        let opdracht_id: number = Number(opdracht_id_string)

        if (isNaN(klas_id)) {
            res.status(400).send({error: "geen geldige klas_id"});
            return;
        }

        const opdracht = prisma.assignment.findUnique({
            where: {
                id: opdracht_id
            }
        })

        const klas = prisma.class.findUnique({
            where: {
                id: klas_id
            }
        })

        if(opdracht == null){
            res.status(400).send({error: "opdracht met opdracht_id ${opdracht_id} bestaat niet."});
            return;
        }

        if(klas === null){
            res.status(400).send({error: "klas met klas_id ${klas_id} bestaat niet."});
            return;
        }

        const newGroup = await prisma.group.create({
            data: {
                assignment: opdracht_id,
                class: klas_id
                
            }
        });
        res.status(200).send("succesful created new group.");
    }catch(e){
        res.status(500).send({error: "internal server error ${e}"})
    }
}

// delete /klassen/:klas_id/opdrachten/:opdracht_id/groepen/:groep_id
export async function opdracht_verwijder_groep(req: Request, res: Response) {
    try{
        let klas_id_string: string = req.params.klas_id;
        let klas_id: number = Number(klas_id_string);

        let opdracht_id_string: string = req.params.opdracht_id;
        let opdracht_id: number = Number(opdracht_id_string)

        let groep_id_string: string = req.params.groep_id
        let groep_id: number = Number(groep_id_string)

        if (isNaN(klas_id)) {
            res.status(400).send({error: "geen geldige klas_id"});
            return;
        }

        if (isNaN(groep_id)) {
            res.status(400).send({error: "geen geldige groep_id"});
            return;
        }

        const opdracht = prisma.assignment.findUnique({
            where: {
                id: opdracht_id
            }
        })

        const klas = prisma.class.findUnique({
            where: {
                id: klas_id
            }
        })


        if(opdracht == null){
            res.status(400).send({error: "opdracht met opdracht_id ${opdracht_id} bestaat niet."});
            return;
        }

        if(klas === null){
            res.status(400).send({error: "klas met klas_id ${klas_id} bestaat niet."});
            return;
        }

        await prisma.group.delete({
            where: {
                id: groep_id,
                class: klas_id,
                assignment: opdracht_id
            }
        })
        res.status(200).send("group succesfull deleted.");
    }catch(e){
        res.status(500).send({error: "internal server error ${e}"})
    }

}