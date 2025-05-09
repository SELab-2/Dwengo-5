<script lang="ts">
    import { currentLanguage, changeLanguage } from "../locales/i18n";
    import { onMount, onDestroy } from "svelte";
    import { get } from "svelte/store";

    // List of supported languages (LibreTranslate supports many)
    const supportedLanguages = [
        { code: 'en', name: 'English' },
        { code: 'nl', name: 'Nederlands' },
        { code: 'fr', name: 'Français' },
        { code: 'de', name: 'Deutsch' },
        { code: 'es', name: 'Español' },
        { code: 'it', name: 'Italiano' },
        { code: 'pt', name: 'Português' },
        { code: 'ru', name: 'Русский' },
        { code: 'zh', name: '中文' },
        { code: 'ja', name: '日本語' },
        { code: 'ar', name: 'العربية' }
    ];

    let selectedLanguage: string = "en";

    onMount(() => {
        selectedLanguage = get(currentLanguage);
    });

    const unsubscribe = currentLanguage.subscribe(lang => {
        selectedLanguage = lang;
    });

    onDestroy(() => {
        unsubscribe();
    });

    function updateLanguage(event: Event) {
        const lang = (event.target as HTMLSelectElement).value;
        changeLanguage(lang);
    }

</script>

<div class="language-selector">
    <img src="../../static/images/globe.png" alt="globe">
    <select bind:value={selectedLanguage} on:change={updateLanguage}>
        {#each supportedLanguages as lang}
            <option value={lang.code}>{lang.name} ({lang.code})</option>
        {/each}
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