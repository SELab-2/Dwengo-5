import {LearningPathNode} from "../../abstract/representation/learning_path_node.ts";
import {PrismaLearningPath} from "./prismaLearningPath.ts";
import {PrismaLearningObject} from "./prismaLearningObject.ts";
import {PrismaTransition} from "./prismaTransition.ts";

export class PrismaLearningPathNode implements LearningPathNode {
    id: number;
    learning_object: PrismaLearningObject;
    start_node?: boolean;
    learning_path: PrismaLearningPath;
    transitions: Array<PrismaTransition>;

    constructor(id: number, learning_object: PrismaLearningObject, learning_path: PrismaLearningPath, transitions: Array<PrismaTransition>, start_node?: boolean) {
        this.id = id;
        this.learning_object = learning_object;
        this.start_node = start_node;
        this.learning_path = learning_path;
        this.transitions = transitions;
    }
}