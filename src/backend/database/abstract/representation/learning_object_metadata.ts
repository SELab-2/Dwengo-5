export enum ContentType {
    PlainText,
    Markdown,
    ImageBlock,
    Image,
    Audio,
    PDF,
    Extern,
    Blocky
}

export interface LearningObjectMetadata {
    id: string;
    uuid: string;
    version: number;
    language: string;
    title: string;
    description: string;
    content_type: ContentType;
    keywords: Array<string>;
    target_ages: Array<string>;
    teacher_exclusive: boolean;
    skos_concepts: Array<string>;
    educatioanl_goals?: JSON;
    copyright?: string;
    license?: string;
    difficulty?: number;
    estimated_time?: number;
    return_value?: JSON;
    available: boolean;
    content_location: string;
}