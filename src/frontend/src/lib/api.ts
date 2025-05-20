import { clearToken, getToken } from "./auth";
import { apiBaseUrl } from "../config";
import { user } from "./stores/user";
import { goto } from "$app/navigation";

export const apiRequest = async (endpoint: string, method: string, options: RequestInit = {}) => {
    const token = getToken();
    if (!token) throw new Error("No token available");

    try {
        const url = `${apiBaseUrl}${endpoint}`;
        console.log("API request:", url);
        const response = await fetch(url, {
            method,
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response) {
            throw new Error("No response received from API (network failure?).");
        }

        if (!response.ok) {
            const errorText = await response.text();
            console.error("API error response:", errorText);
            throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
        }

        // Check if the response has a body before calling `.json()`
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return response.json();
        }

        // If no JSON response, return a success message or null
        return null;

    } catch (error) {
        if (error instanceof Error && error.message.includes("HTTP error 401")) {
            console.log("401");
            clearToken();
            user.set({ role: "", name: "", id: "" });
            goto("/");
        }
        console.error("Fetch error:", error);
        throw error;
    }
};