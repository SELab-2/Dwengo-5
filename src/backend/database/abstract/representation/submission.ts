import {Assignment} from "./assignments.ts";
import {Group} from "./group.ts";
import {Teacher} from "./teacher.ts";

export enum SubmissionType {
    Image,
    Text,
    MultipleChoice,
}

export interface Submission {
    id: number;
    group: Group;
    assignment: Assignment;
    submission_type: SubmissionType;
    submission_content: Object;
    graded_by?: Teacher
}