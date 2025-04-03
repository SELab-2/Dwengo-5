import { writable } from "svelte/store";

type Student = {
    name: string;
    url: string;
};

type LearningPath = {
    img: string;
    name: string;
    description: string;
    content: string;
    url: string;
};

export const groups = writable<Map<number, Student[]>>(new Map([[0, []]]));
export const chosenLearningPath = writable<LearningPath | null>(null);