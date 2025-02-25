import {LearningPath} from "./learning_path.ts";
import {Class} from "./class.ts";
import {Conversation} from "./conversation.ts";
import {Group} from "./group.ts";
import {Submission} from "./submission.ts";

export interface Assignment {
    readonly id: number;
    readonly name: string;
    readonly deadline: Date;
    readonly created_at: Date;
    readonly learning_path: LearningPath;
    readonly class: Class;
    readonly groups: Array<Group>;
    readonly submissions: Array<Submission>;
}