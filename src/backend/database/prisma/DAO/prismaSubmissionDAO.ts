import {Group} from "../../abstract/representation/group";
import {Assignment} from "../../abstract/representation/assignments";
import {Submission, SubmissionType} from "../../abstract/representation/submission";
import {Teacher} from "../../abstract/representation/teacher";
import {SubmissionDAO} from "../../abstract/DAO/submissionDAO";

import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient() // todo dit veranderen

export default class PrismaSubmissionDAO implements SubmissionDAO {
    async createSubmission(group: Group, assignment: Assignment, submission_type: SubmissionType, submission_content: Object, graded_by?: Teacher): Promise<Submission | null> {
        const result = await prisma.submissions.create({
            data: {
                group: group.id,
                assignment: assignment.id,
                SubmissionType: submission_type,
                submission_content: submission_content
            },
            select: { id: true }
        })
        Response.json(result);
        return result.id;
        //throw new Error("Method not implemented.");
    }
    async removeSubmission(submission: Submission): Promise<boolean> {
        try{
            const result = await prisma.student.delete({
                where: {
                    id: Number(submission.id),
                  },
            });
    
            Response.json(result);
            return true;
        }catch(error){
            Response.json({ error: `Submission with ID ${submission.id} does not exist in the database` });
            return false;
        }
        
        //throw new Error("Method not implemented.");
    }
    async updateSubmission(submission: Submission, group?: Group, assignment?: Assignment, submission_type?: SubmissionType, submission_content?: Object, graded_by?: Teacher): Promise<Submission | null> {
        try{
            const updatedSubmission = await prisma.submissions.update({
                where: { id: Number(submission.id)},
                data: { group: group?.id,
                    assignment: assignment?.id,
                    SubmissionType: submission_type,
                    submission_content: submission_content,
                    graded_by: graded_by?.id
                },
              })
            Response.json(updatedSubmission)
        } catch(error){
            Response.json({ error: `Submission with ID ${submission.id} does not exist in the database` })
            return null;
        }
        //throw new Error("Method not implemented.");
    }

    async findSubmission(id: Number): Promise<Submission | null> {
        try{
            const submission = await prisma.submissions.findUnique({
                where: {
                    id: Number(id),
                },
            })
            Response.json(submission);
            return submission;
        } catch(error){
            Response.json({ error: `Submission with ID ${id} does not exist in the database` })
            return null;
        }
        //throw new Error("Method not implemented.");
    }
}
