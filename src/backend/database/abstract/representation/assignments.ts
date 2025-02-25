import {LearningPath} from "./learning_path.ts";
import {Class} from "./class.ts";
import {Conversation} from "./conversation.ts";
import {Group} from "./group.ts";
import {Submission} from "./submission.ts";

export interface Assignment {
    id: number;
    name: string;
    deadline: Date;
    created_at: Date;
    learning_path: LearningPath;
    class: Class;
    conversation: Conversation;
    groups: Array<Group>;
    submissions: Array<Submission>;
}