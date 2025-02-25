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