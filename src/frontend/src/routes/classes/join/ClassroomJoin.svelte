<script lang="ts">
    import { onMount } from "svelte";
    import Header from "../../../lib/components/layout/Header.svelte";
    import { routeTo } from "../../../lib/route.ts";
    import { currentTranslations } from "../../../lib/locales/i18n";

    let classLink = "";
    let errorMessage = "";

    function joinClass() {
        if (!classLink.trim()) {
            errorMessage = $currentTranslations.join.error1;
            return;
        }

        try {
            if (!classLink.includes("/classrooms/join/")) {
                errorMessage = $currentTranslations.join.error1;
                return;
            }

            routeTo(classLink);
        } catch (err) {
            errorMessage = "Invalid URL.";
        }
    }
</script>

<main>
    <Header />

    <div class="container">
        <h1>{$currentTranslations.join.joinClass}</h1>
        <input
            type="text"
            bind:value={classLink}
            placeholder={$currentTranslations.join.paste}
        />
        {#if errorMessage}
            <p class="error">{errorMessage}</p>
        {/if}
        <button on:click={joinClass}>{$currentTranslations.join.join}</button>
    </div>
</main>

<style>

    .container {
        margin: 0 auto;
        width: 100%;
        max-width: 500px;
        background: white;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        text-align: center;
    }

    h1 {
        margin-bottom: 20px;
        font-size: 24px;
    }

    input,
    button {
        width: 100%;
        box-sizing: border-box; /* ensures padding doesn't break layout */
        font-size: 16px;
        border-radius: 8px;
    }

    input {
        padding: 12px;
        border: 1px solid #ccc;
        margin-bottom: 10px;
    }

    .error {
        color: red;
        margin-bottom: 10px;
        font-size: 14px;
    }

    button {
        padding: 12px;
        background-color: #4CAF50;
        color: white;
        border: none;
        cursor: pointer;
    }

    button:hover {
        background-color: #45a049;
    }
</style>
