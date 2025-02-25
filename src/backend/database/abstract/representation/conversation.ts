import {Assignment} from "./assignments.ts";
import {LearningObject} from "./learning_objects.ts";
import {Teacher} from "./teacher.ts";
import {Group} from "./group.ts";
import {Message} from "./message.ts";

export interface Conversation {
    id: number;
    title: string;
    learning_object: LearningObject;
    teachers: Array<Teacher>;
    group: Group;
    assignment: Assignment;
    messages: Array<Message>;
}