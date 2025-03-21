import { writable } from "svelte/store";

export const user = writable<{ name: string; role: string }>({
  name: "",
  role: "",
});
