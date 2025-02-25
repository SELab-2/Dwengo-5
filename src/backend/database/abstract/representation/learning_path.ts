import {LearningPathNode} from "./learning_path_node.ts";

export interface LearningPath {
    hruid: string;
    uuid: string;
    language: string;
    title: string;
    description: string;
    image?: HTMLImageElement;
    learning_path_nodes: Array<LearningPathNode>;
}