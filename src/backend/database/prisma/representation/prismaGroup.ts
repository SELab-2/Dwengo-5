import {Group} from "../../abstract/representation/group.ts";
import {Assignment} from "../../abstract/representation/assignments.ts";
import {Class} from "../../abstract/representation/class.ts";
import {Conversation} from "../../abstract/representation/conversation.ts";
import {Student} from "../../abstract/representation/student.ts";
import {Submission} from "../../abstract/representation/submission.ts";
import {PrismaAssignment} from "./prismaAssignment.ts";
import {PrismaConversation} from "./prismaConversation.ts";
import {PrismaStudent} from "./prismaStudent.ts";
import {PrismaSubmission} from "./prismaSubmission.ts";
import {PrismaClass} from "./prismaClass.ts";

export class PrismaGroup implements Group {
    id: number;
    name: string;
    created_at: Date;
    assignments: PrismaAssignment;
    class: Class;
    conversation: Array<PrismaConversation>;
    students: Array<PrismaStudent>;
    submissions: Array<PrismaSubmission>;

    constructor(id: number, name: string, created_at: Date, assignments: PrismaAssignment, classroom: PrismaClass, conversation: Array<PrismaConversation>, students: Array<PrismaStudent>, submissions: Array<PrismaSubmission>) {
        this.id = id;
        this.name = name;
        this.created_at = created_at;
        this.assignments = assignments;
        this.class = classroom;
        this.conversation = conversation;
        this.students = students;
        this.submissions = submissions;
    }


}