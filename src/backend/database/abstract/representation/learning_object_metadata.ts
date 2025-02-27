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
    readonly id: string;
    readonly uuid: string;
    readonly version: number;
    readonly language: string;
    readonly title: string;
    readonly description: string;
    readonly content_type: ContentType;
    readonly keywords: Array<string>;
    readonly target_ages: Array<string>;
    readonly teacher_exclusive: boolean;
    readonly skos_concepts: Array<string>;
    readonly educational_goals?: JSON;
    readonly copyright?: string;
    readonly license?: string;
    readonly difficulty?: number;
    readonly estimated_time?: number;
    readonly return_value?: JSON;
    readonly available: boolean;
    readonly content_location: string;
}