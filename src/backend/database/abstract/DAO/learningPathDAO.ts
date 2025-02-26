import { LearningPath } from "../representation/learning_path.ts";
import { LearningPathNode } from "../representation/learning_path_node.ts";

interface LearningPathDAO {
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

export default class LearningPathDAOImplementation implements LearningPathDAO {
    createLearningPath(hruid: string, uuid: string, language: string, title: string, description: string, learningPathNodes: Array<LearningPathNode>, image?: HTMLImageElement): LearningPath {
        throw new Error("Method not implemented.");
    }
    removeLearningPath(learningPath: LearningPath): boolean {
        throw new Error("Method not implemented.");
    }
    updateLearningPath(learningPath: LearningPath, title: string, description: string, image?: HTMLImageElement): LearningPath {
        throw new Error("Method not implemented.");
    }
    addLearningPathNode(learningPath: LearningPath, learning_path_node: LearningPathNode): LearningPath | null {
        throw new Error("Method not implemented.");
    }
    findLearningPath(id: Number): LearningPath | null {
        throw new Error("Method not implemented.");
    }

}
