import { LearningPathNode } from "./learning_path_node.ts";

export interface Transition {
    readonly id: number
    readonly condition?: [number, number];
    readonly default?: boolean;
    readonly next?: LearningPathNode;
}