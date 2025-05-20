import { writable } from "svelte/store";

const stored = sessionStorage.getItem("conversationStore");
export const conversationStore = writable(stored ? JSON.parse(stored) : null);

conversationStore.subscribe((value) => {
    if (value) {
        sessionStorage.setItem("conversationStore", JSON.stringify(value));
    }
});
