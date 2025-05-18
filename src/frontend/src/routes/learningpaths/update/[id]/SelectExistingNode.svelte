<script lang="ts">
    import { onMount } from "svelte";
    import { currentTranslations, currentLanguage } from "../../../../lib/locales/i18n";
    import { apiRequest } from "../../../../lib/api";
    import LearningObjectEditor from "./LearningObjectEditor.svelte";
    import type { Graph, GraphNode, NodeContent, Transition } from "../../../../lib/types/graphTypes.ts";

    export let onSelect: (node: GraphNode) => void;

    let learningpathUrls: string[] = [];
    let names: string[] = [];
    let descriptions: string[] = [];

    let selectedPath: string | null = null;


    let learningobjectMetadata: {
        title: string;
        link: string;
        contentLink: string;
    }[] = [];

    let selectedLearningObject: typeof learningobjectMetadata[0] | null = null;
    let updatedContent: string = '';

    let loading = true;
    let loadingObjects = false;

    async function fetchLearningPaths() {
        try {
            const response = await apiRequest(`/learningpaths?language=${$currentLanguage}`, "GET");
            learningpathUrls = response.learningpaths;

            for (const url of learningpathUrls) {
                const res = await apiRequest(url, "GET");
                names.push(res.name);
                descriptions.push(res.description);
            }
            loading = false;
        } catch (error) {
            console.error("Error fetching learning paths", error);
        }
    }

    async function fetchLearningObjects(learningPathUrl: string) {
        loadingObjects = true;
        learningobjectMetadata = [];

        try {
            const pathResponse = await apiRequest(learningPathUrl, "GET");
            const contentUrl = pathResponse.links.content;

            const contentResponse = await apiRequest(contentUrl, "GET");

            const learningObjectSet: Set<string> = new Set();

            // Collect all learningObject URLs
            if (Array.isArray(contentResponse.learningPath)) {
                for (const entry of contentResponse.learningPath) {
                    if (entry.learningObject) {
                        learningObjectSet.add(entry.learningObject);
                    }

                    if (Array.isArray(entry.next)) {
                        for (const nextItem of entry.next) {
                            if (nextItem.link) {
                                learningObjectSet.add(nextItem.link);
                            }
                        }
                    }
                }
            }

            // Fetch metadata for each unique learning object
            for (const loUrl of learningObjectSet) {
                const loResponse = await apiRequest(loUrl, "GET");

                learningobjectMetadata.push({
                    title: loResponse.name,
                    link: loUrl,
                    contentLink: loResponse.links.content
                });
            }

        } catch (error) {
            console.error("Error fetching learning objects", error);
        } finally {
            loadingObjects = false;
        }
    }


    // Handle selecting a path
    async function handlePathSelection(index: number) {
        selectedPath = names[index];
        await fetchLearningObjects(learningpathUrls[index]);
    }

    function handleLearningObjectClick(lo: typeof learningobjectMetadata[0]) {
        const node: GraphNode = {id: lo.link.split('/')[2], title: lo.title};
        console.log(node);
        onSelect(node);
    }

    onMount(fetchLearningPaths);
</script>

{#if loading}
    loading
{:else}
    <div class="selection">
        {#if !selectedPath}
            <h2>{$currentTranslations.createLearningPath.selectExistingNode}</h2>
            <div class="learning-path-container">
                {#each learningpathUrls as url, index}
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <div class="card" on:click={() => handlePathSelection(index)}>
                        <h3>{names[index]}</h3>
                        <p>{descriptions[index]}</p>
                        <p class="url">{url}</p>
                    </div>
                {/each}
            </div>
        {:else}

            {#if loadingObjects}
                <p>{$currentTranslations.learningpath.loading}...</p>
            {:else}
                {#if selectedLearningObject}
                <div>
                    <h3>Edit: {selectedLearningObject.title}</h3>
                    <LearningObjectEditor
                    learningobjectMetadata={selectedLearningObject}
                    onUpdate={(html) => updatedContent = html}
                    />
                </div>
                {:else}
                <div class="learningobject-list">
                    {#each learningobjectMetadata as lo}
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <div class="card" on:click={() => handleLearningObjectClick(lo)}>
                        <h4>{lo.title}</h4>
                    </div>
                    {/each}
                </div>
                {/if}
            {/if}
        {/if}
    </div>
{/if}

<style>
    .selection {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .learning-path-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 20px;
    }

    .card {
        background: var(--dwengo-green);
        border-radius: 10px;
        padding: 20px;
        color: white;
        cursor: pointer;
        transition: transform 0.2s;
    }

    .card:hover {
        transform: translateY(-5px);
        background: var(--green-medium);
    }

    .url {
        font-size: 0.8rem;
        opacity: 0.7;
    }
</style>
