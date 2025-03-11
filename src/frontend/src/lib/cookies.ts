const isBrowser = typeof document !== "undefined";

export function setCookies(name: string, value: string, days: number) {
    if (!isBrowser) return;

    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = `${name}=${value}; path=/;${expires}`;
}

export function getCookies(name: string): string | null {
    if (!isBrowser) return null;

    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
        const [key, value] = cookie.split("=");
        if (key === name) {
            return value;
        }
    }
    return null;
}
