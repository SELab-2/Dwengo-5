import {LearningObject} from "../../abstract/representation/learning_objects.ts";
import {LearningPathNode} from "../../abstract/representation/learning_path_node.ts";
import {Transition} from "../../abstract/representation/transition.ts";
import {LearningPathNodeDAO} from "../../abstract/DAO/learningPathNodeDAO.ts";

export default class PrismaLearningPathNodeDAO implements LearningPathNodeDAO {
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
