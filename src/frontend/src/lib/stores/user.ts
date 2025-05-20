import { writable } from "svelte/store";
import { browser } from "$app/environment";

// Initialize with default values
const defaultUser = { name: "", role: "", id: "" };

// Create the store
export const user = writable<typeof defaultUser>(defaultUser);

// Only run localStorage code in the browser
if (browser) {
  // Initialize from localStorage
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    try {
      user.set(JSON.parse(storedUser));
    } catch (e) {
      console.error("Failed to parse stored user data", e);
      localStorage.removeItem("user");
    }
  }

  // Subscribe to changes
  user.subscribe((value) => {
    if (value?.name) {
      localStorage.setItem("user", JSON.stringify(value));
    } else {
      localStorage.removeItem("user");
    }
  });
}