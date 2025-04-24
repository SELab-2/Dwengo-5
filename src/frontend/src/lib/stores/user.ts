import { writable } from "svelte/store";

// Try to load the users from localStorage (fallback to default empty object)
const storedUser = localStorage.getItem("user");
export const user = writable<{ name: string; role: string; id: string }>(
  storedUser ? JSON.parse(storedUser) : { name: "", role: "", id: "" }
);

// Subscribe to store updates and save changes to localStorage
user.subscribe((value) => {
  if (value && value.name) {
    localStorage.setItem("user", JSON.stringify(value));
  } else {
    localStorage.removeItem("user"); // Clear storage when users logs out
  }
});
