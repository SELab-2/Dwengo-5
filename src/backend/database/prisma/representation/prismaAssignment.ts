import {Assignment} from "../../abstract/representation/assignments.ts";
import {Class} from "../../abstract/representation/class.ts";
import {Conversation} from "../../abstract/representation/conversation.ts";
import {Group} from "../../abstract/representation/group.ts";
import {LearningPath} from "../../abstract/representation/learning_path.ts";
import {Submission} from "../../abstract/representation/submission.ts";
import {PrismaClient} from "@prisma/client";
import {PrismaClass} from "./prismaClass.ts";
import {PrismaConversation} from "./prismaConversation.ts";

export class PrismaAssignment implements Assignment {
    class: PrismaClass;
    conversations: Array<Conversation>;
    created_at: Date;
    deadline: Date;
    groups: Array<Group>;
    id: number;
    learning_path: LearningPath;
    name: string;
    submissions: Array<Submission>;

    constructor(classroom: PrismaClass, conversations: Array<PrismaConversation>, created_at: Date, deadline: Date, groups: Array<Group>, id: number, learning_path: LearningPath, name: string, submissions: Array<Submission>) {
        this.class = classroom;
        this.conversations = conversations;
        this.created_at = created_at;
        this.deadline = deadline;
        this.groups = groups;
        this.id = id;
        this.learning_path = learning_path;
        this.name = name;
        this.submissions = submissions;
    }

}