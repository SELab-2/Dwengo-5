import {Assignment} from "./assignments.ts";
import {LearningObject} from "./learning_objects.ts";
import {Teacher} from "./teacher.ts";
import {Group} from "./group.ts";
import {Message} from "./message.ts";

export interface Conversation {
    readonly id: number;
    readonly title: string;
    readonly learning_object: LearningObject;
    readonly teachers: Array<Teacher>;
    readonly group: Group;
    readonly assignment: Assignment;
    readonly messages: Array<Message>;
}