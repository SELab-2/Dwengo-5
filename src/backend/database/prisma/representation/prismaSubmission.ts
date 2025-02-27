import {Submission, SubmissionType} from "../../abstract/representation/submission.ts";
import {Assignment} from "../../abstract/representation/assignments.ts";
import {Teacher} from "../../abstract/representation/teacher.ts";
import {Group} from "../../abstract/representation/group.ts";
import {PrismaAssignment} from "./prismaAssignment.ts";
import {PrismaTeacher} from "./prismaTeacher.ts";
import {PrismaGroup} from "./prismaGroup.ts";

export class PrismaSubmission implements Submission {
    id: number;
    created_at: Date;
    content: string;
    grade: number;
    assignment: PrismaAssignment;
    graded_by: PrismaTeacher;
    group: PrismaGroup;
    submission_content: Object;
    submission_type: SubmissionType;

    constructor(id: number, created_at: Date, content: string, grade: number, group: PrismaGroup, assignment: PrismaAssignment, graded_by: PrismaTeacher, submission_content: Object, submission_type: SubmissionType) {
        this.id = id;
        this.created_at = created_at;
        this.content = content;
        this.grade = grade;
        this.group = group;
        this.assignment = assignment;
        this.graded_by = graded_by;
        this.submission_content = submission_content;
        this.submission_type = submission_type;
    }

}