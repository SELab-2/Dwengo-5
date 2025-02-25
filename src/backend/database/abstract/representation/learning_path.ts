import {LearningPathNode} from "./learning_path_node.ts";

export interface LearningPath {
    readonly hruid: string;
    readonly uuid: string;
    readonly language: string;
    readonly title: string;
    readonly description: string;
    readonly image?: HTMLImageElement;
    readonly learning_path_nodes: Array<LearningPathNode>;
}