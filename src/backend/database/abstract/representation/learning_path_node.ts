import {LearningObject} from "./learning_objects.ts";
import {Transition} from "./transition.ts";

export interface LearningPathNode {
    id: number
    learning_object: LearningObject;
    start_node?: boolean;
    learning_path: LearningPathNode;
    transitions: Array<Transition>;
}