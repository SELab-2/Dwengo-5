import { getToken } from "./auth";
import { apiBaseUrl } from "../config";

export const apiRequest = async (endpoint: string, method: string, body = null, options: RequestInit = {}) => {
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
                "Content-Type": "application/json",
            },
            body: body ? JSON.stringify(body) : null,
        });

        if (!response) {
            throw new Error("No response received from API (network failure?).");
        }

        if (!response.ok) {
            const errorText = await response.text();
            console.error("API error response:", errorText);
            throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
        }
        console.log("API response:", response);

        // TODO: doesn't work right rn
        return response.json();

    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
};
