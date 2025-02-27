import {LearningPath} from "../../abstract/representation/learning_path.ts";
import {LearningPathNode} from "../../abstract/representation/learning_path_node.ts";
import {PrismaLearningPathNode} from "./prismaLearningPathNode.ts";

export class PrismaLearningPath implements LearningPath {
    id: number;
    title: string;
    description: string;
    hruid: string;
    uuid: string;
    version: string;
    language: string;
    learning_path_nodes: Array<PrismaLearningPathNode>;

    image?: HTMLImageElement;

    constructor(id: number, title: string, description: string, hruid: string, uuid: string, version: string, language: string, learning_path_nodes: Array<PrismaLearningPathNode>, image?: HTMLImageElement){
        this.id = id;
        this.title = title;
        this.description = description;
        this.hruid = hruid;
        this.uuid = uuid;
        this.version = version;
        this.language = language;
        this.learning_path_nodes = learning_path_nodes;

        image ? this.image = image : null;
    }


}