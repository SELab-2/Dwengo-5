import {LearningPathNode} from "./learning_path_node.ts";

export interface Transition {
    id: number
    condition?: [number, number];
    default?: boolean;
    next?: LearningPathNode;
}