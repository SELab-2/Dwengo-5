<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import Header from "../../lib/components/layout/Header.svelte";
    import { currentTranslations, savedLanguage, currentLanguage } from "../../lib/locales/i18n";
    import Footer from "../../lib/components/layout/Footer.svelte";
    import Drawer from "../../lib/components/features/Drawer.svelte";
    import { apiRequest } from "../../lib/api";
    import { user } from "../../lib/stores/user.ts";
    import { get } from "svelte/store";
    import { createSearchStore, searchHandler } from "../../lib/stores/search.ts";
    import { routeTo } from "../../lib/route.ts"
    import ErrorBox from "../../lib/components/features/ErrorBox.svelte";

    $: translatedTitle = $currentTranslations.catalog.title.replace(
        /{ (.*?) }/g,
        (_, text) => `<span style="color:#80cc5d">${text}</span><br>`
    );

    interface LearningPath {
        name: string;
        image: string;
        description: string;
        url: string;
        searchTerms: string;
        links: {
            content: string;
        };
        theme: string;
        id: string;
        empty: boolean;
    }

    function getQueryParamsURL() {
		const urlParams = new URLSearchParams(window.location.search);
		return {
			role: urlParams.get('role') || "",
			id: urlParams.get('id') || ""
		};
	}
	let role: string, id: string  = "";

    role = getQueryParamsURL().role;
    id = getQueryParamsURL().id;

    let learningPaths: LearningPath[] = [];
    let searchProducts: Array<LearningPath & { searchTerms: string }> = [];
    let errorMessage: string = "";

    async function fetchLearningPaths(language: string) {
        try {
            // Fetch learning path urls
            const response = await apiRequest(`/learningpaths?language=${language}`, "GET");
            const learningpaths = response.learningpaths;
            // Fetch all learning paths
            const learningPathData = await Promise.all(
            learningpaths.map(async (path: string) => {
                const res = await apiRequest(`${path}?language=${savedLanguage}`, "GET");
                // Assuming res is of type any or not strictly typed
                const learningPath = res as LearningPath;
                learningPath.id = path.split("/")[2];
                learningPath.url = path;
                const resp = await apiRequest(`${learningPath.url}`, "GET");
                const content = await apiRequest(`${resp.links.content}`, "GET");
                //if(content.learningpath)
                if(content.learningPath.length > 0){
                    learningPath.empty = false;
                }
                else{
                    learningPath.empty = true;
                }
                return learningPath;
            }));

            learningPaths = learningPathData;
        } catch (error) {
            console.error("Error fetching learning paths:", error);
        }
    }

    // This will search for a match of name/description in the learningPaths
    $: searchProducts = learningPaths.map((learningPath) => ({
        ...learningPath,
        searchTerms: `${learningPath.name} ${learningPath.description}`
    }));

    let searchStore = createSearchStore<LearningPath>([]);
        
    $: searchStore.set({
        data: searchProducts,
        filtered: searchProducts,
        search: $searchStore?.search || ""
    });
    

    const unsubscribe = searchStore.subscribe((model) => searchHandler(model));

    onDestroy(unsubscribe);

    // Fetch learning paths on mount
    onMount(() => {
        console.log(searchStore[0]);
        fetchLearningPaths(get(currentLanguage));
    });

    // Fetch learning paths when the language changes
    $: {
        const lang = $currentLanguage;
        fetchLearningPaths(lang);
    }

    async function goTo(url: string) {
        const response = await apiRequest(`${url}`, "GET");
        const content = await apiRequest(`${response.links.content}`, "GET");
        console.log(content)
        if(content.learningPath.length !== 0){
            const go = url + content.learningPath[0].learningObject;
            routeTo(go);
        }
        else{
            errorMessage = "Learningpath is empty."
        }
       
    }
</script>

<main>
    {#if user}
        <Header/>
        <div class="container">
            <div class="title-container">
                <p class="title">{ @html translatedTitle }</p>
            </div>

            {#if errorMessage}
                <ErrorBox {errorMessage} on:close={() => (errorMessage = "")}/>
            {/if}

            {#if role === "teacher"}
                <button class="create-learnpath" on:click={() => {routeTo(`/learningpaths/create`);
						}}>Create Learnpath</button>
            {/if}

            <div class="bottom">

                <div class="catalog-content">
                    <div class="search-box">
                        <input class="input-search" type="search" placeholder="search..." bind:value={$searchStore.search} />
                    </div>
                    <ul>
                        {#if $searchStore.filtered}
                            {#each $searchStore.filtered as learningPath}
                                <li>
                                    <div class="header">
                                        {#if learningPath.image === null}
											<img class="image" src="/images/dwengo-groen-zwart.svg" alt="learning-path" />
										{:else}
											<img class="image"  src="data:image/png;base64, {learningPath.image}" alt="learning-path" />
										{/if}
                                        <h1>{learningPath.name}</h1>
                                    </div>

                                    <div class="content">
                                        <p>{learningPath.description}</p>
                                        <!--TODO fix why this url does not work?-->
                                        {#if learningPath.empty}
                                            <a href={learningPath.url} on:click|preventDefault={async () => routeTo(`/learningpaths/update/${learningPath.id}`)} class="learning-path-link">
                                                update &gt;
                                            </a>
                                        {:else}
                                            <a href={learningPath.url} on:click|preventDefault={async () => goTo(learningPath.url)} class="learning-path-link">
                                                {$currentTranslations.learningpath.learnMore}&gt;
                                            </a>
                                        {/if}
                                    </div>
                                </li>
                            {/each}
                        {:else}
                            <li>{$currentTranslations.learningpath.notFound}</li>
                        {/if}
                    </ul>
                    <img src="/images/miss-B.png" alt="Miss B" class="miss-b" />
                </div>
            </div>
        </div>
    <Footer />
    {:else}
        <p class="error">{$currentTranslations.assignments.notFound}</p>
    {/if}
</main>

<style>
    .create-learnpath {
        margin-bottom: 15px;
        align-self: flex-end;
        background: var(--dwengo-green);
        color: white;
        border: none;
        height: 30px;
    }

    .miss-b {
        position: absolute;
        bottom: 0;
        left: 0;
        width: auto; /* Adjust size as needed */
        height: 40%; /* Maintain aspect ratio */
    }

    main {
        display: flex;
        flex-direction: column;
        min-height: 100vh; /* Full viewport height */
    }

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    .container {
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
        padding-top: 50px;
    }

    .title-container {
        flex: 0;
        padding-left: 20px;
    }

    .bottom {
        flex: 1;
        display: flex;
    }

    .catalog-content {
		flex: 1;
		background-color: white;
		margin-left: 100px;
		margin-right: 100px;
		margin-top: 30px;
		border-radius: 15px;
		border: 15px solid var(--dwengo-green);
		padding-left: 15px;
		padding-right: 15px;
		padding-top: 10px;
		padding-bottom: 10px;
		max-height: 70vh; /* Adjust height as needed */
		overflow-y: auto; /* Enables vertical scrolling */
        min-width: 400px;
        word-wrap: break-word;   /* Break long words */
	    overflow-wrap: break-word;
  	}

    li {
		font-family: 'C059-Italic'; 
		list-style-type: none;
		margin-bottom: 30px;
		box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* Add shadow */
		border-radius: 10px; /* Optional: Add rounded corners */
		padding: 15px; /* Optional: Add padding for better spacing */
		background-color: #fff; /* Optional: Ensure background is white */
    }

    ul {
		display: flex;
		flex-direction: column;
		gap: 20px;
		padding: 20px;
        word-wrap: break-word;   /* Break long words */
	    overflow-wrap: break-word;
    }

    /* styling per catalog item */
    .header {
		display: flex;
		align-items: center; /* Aligns image and text vertically */
		gap: 15px; /* Adds space between image and text */
    }


    img {
		width: auto;
		height: 50px;
        pointer-events: none;
    }

    li {
		list-style: none;
		margin-bottom: 30px;
    }

    .learning-path-link {
		display: inline-block; /* Ensures margin applies properly */
		margin-top: 20px; /* Adjust as needed */
		font-family: sans-serif;
		font-size: 0.8rem;
		text-decoration: none; /* Removes underline */
		color: blue;
  	}

	.input-search {
		flex: 1;
		height: 50px;
		border-style: none;
		padding: 10px;
		font-size: 18px;
		letter-spacing: 2px;
		outline: none;
		transition: all 0.5s ease-in-out;
		padding-right: 40px;
		color: #000000;
		width: 300px;
		border-radius: 0px;
		background-color: transparent;
		border-bottom: 1px solid black;
  	}

	.search-box { 
		display: flex; /* Add this to position the button correctly within this container */
		align-items: center;
		gap: 10px; /* Space between input and button */
		padding-left: 20px;
		padding-right: 20px;
		padding-bottom: 15px;
    }
</style>