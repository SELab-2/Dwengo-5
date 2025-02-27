import {LearningPathNode} from "../../abstract/representation/learning_path_node.ts";
import {LearningPath} from "../../abstract/representation/learning_path.ts";
import {LearningPathDAO} from "../../abstract/DAO/learningPathDAO.ts";

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
