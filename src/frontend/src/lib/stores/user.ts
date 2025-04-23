import { writable } from "svelte/store";

// Try to load the user from localStorage (fallback to default empty object)
const storedUser = localStorage.getItem("user");
export const user = writable<{ name: string; role: string; id: string }>(
  storedUser ? JSON.parse(storedUser) : { name: "", role: "", id: "" }
);

// Subscribe to store updates and save changes to localStorage
user.subscribe((value) => {
  if (value && value.name) {
    console.log("User data updated:", value);
    localStorage.setItem("user", JSON.stringify(value));
  } else {
    console.log("User logged out or data cleared");
    localStorage.removeItem("user"); // Clear storage when user logs out
  }
});
