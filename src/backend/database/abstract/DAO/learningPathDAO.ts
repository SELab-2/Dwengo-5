import { LearningPath } from "../representation/learning_path.ts";
import { LearningPathNode } from "../representation/learning_path_node.ts";

export interface LearningPathDAO {
    createLearningPath(
        hruid: string,
        uuid: string,
        language: string,
        title: string,
        description: string,
        learningPathNodes: Array<LearningPathNode>,
        image?: HTMLImageElement,
    ): LearningPath

    removeLearningPath(
        learningPath: LearningPath,
    ): boolean;

    updateLearningPath(
        learningPath: LearningPath,
        title: string,
        description: string,
        image?: HTMLImageElement,
    ): LearningPath

    addLearningPathNode(learningPath: LearningPath, learning_path_node: LearningPathNode): LearningPath | null;

    findLearningPath(id: Number): LearningPath | null;
}