import { writable } from "svelte/store";
import enHome from "./en/home";
import nlHome from "./nl/home";
import enHeader from "./en/header";
import nlHeader from "./nl/header";
import enLogin from "./en/login";
import nlLogin from "./nl/login";

const translationsMap: { 
    [key: string]: { 
        home: typeof enHome; 
        header: typeof enHeader; 
        login: typeof enLogin;
    } 
} = {
    en: { home: enHome, header: enHeader, login: enLogin },
    nl: { home: nlHome, header: nlHeader, login: nlLogin },
};

export const currentLanguage = writable("en");
export const translations = writable(translationsMap.en);

export function changeLanguage(lang: "en" | "nl") {
    if (translationsMap[lang]) {
        currentLanguage.set(lang);
        translations.set(translationsMap[lang]);
    }
}
