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

export const groups = writable<{ id: number; name: string; students: Student[] }[]>([
    { id: 0, name: "1", students: [] }
]);

export const chosenLearningPath = writable<LearningPath | null>(null);