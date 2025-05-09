<script lang="ts">
    import { currentLanguage, changeLanguage } from "../locales/i18n";
    import { onMount, onDestroy } from "svelte";
    import { get } from "svelte/store";

    let selectedLanguage: "en" | "nl" | "de" | "fr" | "es" | "it" = "en"; // Default to English, add new languages 

    onMount(() => {
        selectedLanguage = get(currentLanguage) as "en" | "nl" | "de" | "fr" | "es" | "it"; //add new languages
    });

    const unsubscribe = currentLanguage.subscribe(lang => {
        if (lang === "en" || lang === "nl" || lang === "de" || lang === "fr" || lang === "es" || lang === "it") {
            selectedLanguage = lang;
        }
    });

    onDestroy(() => {
        unsubscribe();
    });

    function updateLanguage() {
        changeLanguage(selectedLanguage);
    }
</script>

<div class="language-selector">
    <img src="../../static/images/globe.png" alt="globe">
    <select bind:value={selectedLanguage} on:change={updateLanguage}>
        <option value="en">en</option>
        <option value="nl">nl</option>
        <option value="de">de</option>
        <option value="fr">fr</option>
        <option value="es">es</option>
        <option value="it">it</option>
        <!--add new languages-->
    </select>
</div>

<style>
    .language-selector {
        display: flex;         
        align-items: center;
        gap: 3px;
    }

    img {
        width: 20px;
        height: 20px;
    }

    select {
        border: none;
        background-color: transparent;
        font-size: 16px;
        cursor: pointer;
        padding-left: 0px;
    }
</style>
