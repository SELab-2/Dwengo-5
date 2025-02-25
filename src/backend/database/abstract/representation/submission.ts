import {Assignment} from "./assignments.ts";
import {Group} from "./group.ts";
import {Teacher} from "./teacher.ts";

export enum SubmissionType {
    Image,
    Text,
    MultipleChoice,
}

export interface Submission {
    readonly id: number;
    readonly group: Group;
    readonly assignment: Assignment;
    readonly submission_type: SubmissionType;
    readonly submission_content: Object;
    readonly graded_by?: Teacher
}