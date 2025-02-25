import { Class } from "./class.ts";
import { Assignment } from "./assignments.ts";
import { Conversation } from "./conversation.ts";
import { Submission } from "./submission.ts";
import { Student } from "./student.ts";

export interface Group {
    readonly id: number;
    readonly name: string;
    readonly class: Class;
    readonly assignments: Assignment; 
    readonly students: Array<Student>;
    readonly conversation: Array<Conversation>;
    readonly submissions: Array<Submission>;
}