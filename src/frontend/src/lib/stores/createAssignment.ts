import { writable } from "svelte/store";

type Student = {
    name: string;
    url: string;
};

export const groups = writable<{ id: number; students: Student[] }[]>([{ id: 0, students: [] }]);
export const groupCounter = writable(0);
export const allStudents = writable<Student[]>([]);
export const selectedStudents = writable<Student[]>([]);
export const chosenLearningPath = writable(null);