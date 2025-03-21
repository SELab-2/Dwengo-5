import { getToken } from "./auth";
import { apiBaseUrl } from "../config";

export const apiRequest = async (endpoint: string, method: string, options: RequestInit = {}) => {
    const token = getToken();
    if (!token) throw new Error("No token available");

    try {
        const url = `${apiBaseUrl}${endpoint}`;
        console.log(`Fetching: ${url} with method: ${method}`);

        const response = await fetch(url, {
            method,
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        console.log("Raw response:", response);

        if (!response) {
            throw new Error("No response received from API (network failure?).");
        }

        console.log("Response status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("API error response:", errorText);
            throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
};
