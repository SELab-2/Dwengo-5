import {PrismaLearningPathNode} from "./prismaLearningPathNode.ts";
import {Transition} from "../../abstract/representation/transition.ts";

export class PrismaTransition implements Transition {
    id: number;
    source_node: PrismaLearningPathNode;
    target_node: PrismaLearningPathNode;
    transition_type: string;
    transition_data: string;

    constructor(id: number, source_node: PrismaLearningPathNode, target_node: PrismaLearningPathNode, transition_type: string, transition_data: string) {
        this.id = id;
        this.source_node = source_node;
        this.target_node = target_node;
        this.transition_type = transition_type;
        this.transition_data = transition_data
    }
}