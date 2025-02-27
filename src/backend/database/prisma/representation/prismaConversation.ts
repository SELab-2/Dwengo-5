import {Conversation} from "../../abstract/representation/conversation.ts";
import {PrismaMessage} from "./prismaMessage.ts";
import {PrismaTeacher} from "./prismaTeacher.ts";
import {PrismaAssignment} from "./prismaAssignment.ts";
import {PrismaGroup} from "./prismaGroup.ts";
import {PrismaLearningObject} from "./prismaLearningObject.ts";

export class PrismaConversation implements Conversation {
    id: number;
    name: string;
    created_at: Date;
    messages: Array<PrismaMessage>;
    users: Array<string>;
    title: string;
    learning_object: PrismaLearningObject;
    teachers: Array<PrismaTeacher>;
    group: PrismaGroup;
    assignment: PrismaAssignment;

    constructor(id: number, name: string, created_at: Date, messages: Array<PrismaMessage>, users: Array<string>, title: string, learning_object: PrismaLearningObject, teachers: Array<PrismaTeacher>, group: PrismaGroup, assignment: PrismaAssignment) {
        this.id = id;
        this.name = name;
        this.created_at = created_at;
        this.messages = messages;
        this.users = users;
        this.title = title;
        this.learning_object = learning_object;
        this.teachers = teachers;
        this.group = group;
        this.assignment = assignment
    }
}