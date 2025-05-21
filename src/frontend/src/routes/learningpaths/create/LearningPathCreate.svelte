<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import Header from "../../../lib/components/layout/Header.svelte";
    import Footer from "../../../lib/components/layout/Footer.svelte";

    import ErrorBox from "../../../lib/components/features/ErrorBox.svelte";
    import "../../../lib/styles/global.css";
    import {
        currentTranslations,
        savedLanguage,
        currentLanguage,
    } from "../../../lib/locales/i18n";
    import cytoscape from "cytoscape";
    import dagre from "cytoscape-dagre";
    import { apiRequest } from "../../../lib/api";
    import { routeTo } from "../../../lib/route.ts";
    import { user } from "../../../lib/stores/user.ts";

    let title: string = "";
    let hruuid: string = "";
    let language: string = "";
    let description: string = "";
    let languageChoices = ["en", "de", "nl", "fr", "it", "es"];
    let errorMessage: string = "";

    async function postLearningpath() {
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get("id");
        const userRole = urlParams.get("role");
        if ($user.role !== userRole || $user.id !== userId) {
            errorMessage =
                "You are not allowed to create a learningpath as someone else";
            return;
        }

        if (title.trim() && language.trim() && description.trim()) {
            try {
                const response = await apiRequest(`/learningpaths`, "POST", {
                    body: JSON.stringify({
                        title: title.trim(),
                        language: language.trim(),
                        description: description.trim(),
                    }),
                });
                title = "";
                language = "";
                description = "";

                const learningpathUrl = response.learningpath;
                const learningpathId = learningpathUrl.split("/").pop();
                routeTo(`/learningpaths/update/${learningpathId}`);
            } catch (error) {
                console.error("Error creating learningpath: " + error);
            }
        }
    }
</script>

<Header></Header>
<main>
    <h1>
        <!--TODO vertalen-->
        Create Learningpath
    </h1>
    <form on:submit|preventDefault={postLearningpath}>
        <!--TODO vertalen die handel-->
        <label for="title">Title</label>
        <input
            type="text"
            id="title"
            bind:value={title}
            required
            placeholder="Type your Title here..."
        />
        <label for="description">Description</label>
        <textarea
            id="description"
            bind:value={description}
            required
            placeholder="Type your Description here..."
            rows="4"
        ></textarea>
        <label for="language">Language</label>
        <select id="language" bind:value={language} required>
            <option value="" disabled selected>Select a language</option>
            {#each languageChoices as lang}
                <option value={lang}>{lang}</option>
            {/each}
        </select>
        <button type="submit">Create Learningpath</button>
    </form>
    <div class="spacing"></div>

    {#if errorMessage}
        <ErrorBox {errorMessage} on:close={() => (errorMessage = "")} />
    {/if}
</main>

<style>
    .spacing {
        height: 20px;
    }
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100vh;
        background-color: var(--dwengo-light);
    }
    button {
        cursor: pointer;
        border: 0;
        border-radius: 8px;
        font-weight: 600;
        margin: 0 10px;
        width: 200px;
        padding: 12px 0;
        text-transform: uppercase;
        background-color: var(--dwengo-green);
        letter-spacing: 1px;
        transition: all 0.3s ease-in-out;
        box-shadow: 0 8px 15px rgba(62, 235, 125, 0.2);
    }
    button:hover {
        transform: translateY(-2px);
        box-shadow: 0 0 25px rgba(34, 197, 94, 0.6);
    }
    select,
    input,
    textarea {
        border: 2px solid var(--dwengo-green);
        border-radius: 8px;
        padding: 10px;
        margin-bottom: 20px;
    }

    select:focus,
    input:focus,
    textarea:focus {
        outline: none;
        border-color: var(--dwengo-green);
        box-shadow: 0 0 5px rgba(34, 197, 94, 0.5);
    }
    label {
        font-weight: bold;
        margin-bottom: 5px;
    }
    h1 {
        text-align: center;
        margin-bottom: 20px;
        color: var(--dwengo-green);
    }
    form {
        border-color: var(--dwengo-green);
        border-radius: 8px;
        border-width: 8px;
        border-style: solid;
        display: flex;
        flex-direction: column;
        gap: 20px;
        width: 300px;
        margin: 0 auto;
        padding: 20px;
    }
</style>
