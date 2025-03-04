import {Request, Response} from "express";
import {PrismaClient} from '@prisma/client'
import {website_base} from "../../../../../index.ts";

const prisma = new PrismaClient() //todo vervang dit later door export in index.ts


// GET /klassen/:klas_id/opdrachten/:opdracht_id/groepen/:groep_id/leerlingen
export async function groep_leerlingen(req: Request, res: Response) {
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

        if (isNaN(opdracht_id)) {
            res.status(400).send({error: "geen geldige opdracht_id"});
            return;
        }

        if (isNaN(groep_id)) {
            res.status(400).send({error: "geen geldige groep_id"});
            return;
        } 

        const opdracht = prisma.assigments.dindUnique({
            where: {
                id: opdracht_id
            }
        })

        const groep = prisma.groups.dindUnique({
            where: {
                id: groep_id
            }
        })

        const klas = prisma.classes.findUnique({
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

        if(groep === null){
            res.status(400).send({error: "groep met klas_id ${groep_id} bestaat niet."});
            return;
        }

        const leerlingen = await prisma.students.findMany({
            where: {
                
            }
        })

    }catch(error){

    }
    res.status(501);
}

export async function groep_voeg_leerling_toe(req: Request, res: Response) {
    res.status(501);
}

export async function groep_verwijder_leerling(req: Request, res: Response) {
    res.status(501);
}