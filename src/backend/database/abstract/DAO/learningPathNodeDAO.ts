import { LearningPathNode } from "../representation/learning_path_node.ts";
import { LearningObject } from "../representation/learning_objects.ts";
import { Transition } from "../representation/transition.ts";

interface LearningPathNodeDAO {
    createLearningPathNode(
        learning_object: LearningObject,
        learning_path: LearningPathNode,
        transitions: Array<Transition>,
        start_node?: boolean,
    ): LearningPathNode;

    removeLearningPathNode(
        learningPathNode: LearningPathNode,
    ): boolean

    updateLearningPathNode(
        learning_object?: LearningObject,
        learning_path?: LearningPathNode,
        start_node?: boolean,
    ): LearningPathNode;

    addTransitions(
        learningPathNode: LearningPathNode,
        transition: Array<Transition>,
    ): LearningPathNode;
    removeTransition(
        learningPathNode: LearningPathNode,
        transition: Array<Transition>,
    ): LearningPathNode;

    findLearningPathNode(id: Number): LearningPathNode | null;
}

export default class LearningPathNodeDAOImplementation implements LearningPathNodeDAO {
    createLearningPathNode(learning_object: LearningObject, learning_path: LearningPathNode, transitions: Array<Transition>, start_node?: boolean): LearningPathNode {
        throw new Error("Method not implemented.");
    }
    removeLearningPathNode(learningPathNode: LearningPathNode): boolean {
        throw new Error("Method not implemented.");
    }
    updateLearningPathNode(learning_object?: LearningObject, learning_path?: LearningPathNode, start_node?: boolean): LearningPathNode {
        throw new Error("Method not implemented.");
    }
    addTransitions(learningPathNode: LearningPathNode, transition: Array<Transition>): LearningPathNode {
        throw new Error("Method not implemented.");
    }
    removeTransition(learningPathNode: LearningPathNode, transition: Array<Transition>): LearningPathNode {
        throw new Error("Method not implemented.");
    }
    findLearningPathNode(id: Number): LearningPathNode | null {
        throw new Error("Method not implemented.");
    }

}
