import {Class} from "./class.ts";
import {Assignment} from "./assignments.ts";
import {Conversation} from "./conversation.ts";
import {Submission} from "./submission.ts";

export interface Group {
    id: number;
    name: string;
    class: Class;
    assignment: Assignment;
    conversation: Array<Conversation>;
    submissions: Array<Submission>;
}