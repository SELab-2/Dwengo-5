import { LearningObject } from "./learning_objects.ts";
import { Transition } from "./transition.ts";

export interface LearningPathNode {
    readonly id: number
    readonly learning_object: LearningObject;
    readonly start_node?: boolean;
    readonly learning_path: LearningPathNode;
    readonly transitions: Array<Transition>;
}