import {Group} from "../../abstract/representation/group.ts";
import {Assignment} from "../../abstract/representation/assignments.ts";
import {Submission, SubmissionType} from "../../abstract/representation/submission.ts";
import {Teacher} from "../../abstract/representation/teacher.ts";
import {SubmissionDAO} from "../../abstract/DAO/submissionDAO.ts";

export default class PrismaSubmissionDAO implements SubmissionDAO {
    createSubmission(group: Group, assignment: Assignment, submission_type: SubmissionType, submission_content: Object, graded_by?: Teacher): Submission | null {
        throw new Error("Method not implemented.");
    }
    removeSubmission(submission: Submission): boolean {
        throw new Error("Method not implemented.");
    }
    updateSubmission(submission: Submission, group?: Group, assignment?: Assignment, submission_type?: SubmissionType, submission_content?: Object, graded_by?: Teacher): Submission | null {
        throw new Error("Method not implemented.");
    }
    findSubmission(id: Number): Submission | null {
        throw new Error("Method not implemented.");
    }
}
