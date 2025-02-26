import { Submission, SubmissionType } from "../representation/submission.ts";
import { Group } from "../representation/group.ts";
import { Assignment } from "../representation/assignments.ts";
import { Teacher } from "../representation/teacher.ts";

interface SubmissionDAO {
    createSubmission(
        group: Group,
        assignment: Assignment,
        submission_type: SubmissionType,
        submission_content: Object,
        graded_by?: Teacher,
    ): Submission | null;

    removeSubmission(
        submission: Submission,
    ): boolean

    updateSubmission(
        submission: Submission,
        group?: Group,
        assignment?: Assignment,
        submission_type?: SubmissionType,
        submission_content?: Object,
        graded_by?: Teacher,
    ): Submission | null;

    findSubmission(id: Number): Submission | null;
}

export default class SubmissionDAOImplementation implements SubmissionDAO {
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
