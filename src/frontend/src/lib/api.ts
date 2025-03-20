import { getToken } from "./auth";
import { apiBaseUrl } from "../config";

export const authFetch = async (endpoint: string, options: RequestInit = {}) => {
    const token = getToken();
    if (!token) throw new Error("No token available");

    const response = await fetch(`${apiBaseUrl}${endpoint}`, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) throw new Error(response.statusText);
    return response.json();
};
