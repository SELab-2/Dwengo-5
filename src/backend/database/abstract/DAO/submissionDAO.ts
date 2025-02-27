import { Submission, SubmissionType } from "../representation/submission.ts";
import { Group } from "../representation/group.ts";
import { Assignment } from "../representation/assignments.ts";
import { Teacher } from "../representation/teacher.ts";

export interface SubmissionDAO {
    createSubmission(
        group: Group,
        assignment: Assignment,
        submission_type: SubmissionType,
        submission_content: Object,
        graded_by?: Teacher,
    ): Promise<Submission | null>;

    removeSubmission(
        submission: Submission,
    ): Promise<boolean>

    updateSubmission(
        submission: Submission,
        group?: Group,
        assignment?: Assignment,
        submission_type?: SubmissionType,
        submission_content?: Object,
        graded_by?: Teacher,
    ): Promise<Submission | null>;

    findSubmission(id: Number): Promise<Submission | null>;
}