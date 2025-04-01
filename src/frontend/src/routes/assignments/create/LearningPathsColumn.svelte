<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { currentLanguage, currentTranslations } from "../../../lib/locales/i18n";
	import SearchBar from "../../../lib/components/features/SearchBar.svelte";
	import { createSearchStore, searchHandler } from "../../../lib/stores/search.ts";
	import "../../../lib/styles/global.css";
	import { apiBaseUrl } from "../../../config";
	import { apiRequest } from "../../../lib/api";
	import { user } from "../../../lib/stores/user.ts";
    import { chosenLearningPath } from "../../../lib/stores/createAssignment.ts"; // Import store
    import { get } from "svelte/store";

	type LearningPath = {
		img: string;
		name: string;
		description: string;
		content: string;
		url: string;
	};

	let learningPaths: LearningPath[] = [];
    let searchProducts: Array<LearningPath & { searchTerms: string }> = [];
	
	// Learning paths

	// Selected learning path
	function selectLearningPath(path: LearningPath) {
		chosenLearningPath.set(path);
    	}


	// All learning paths
	async function fetchLearningPaths(language: string) {
		try {
			// Fetch learning path urls
			const response = await apiRequest(`/learningpaths?language=${language}`, "get");
			const learningpaths = response.learningpaths;	

			// Fetch all learning paths
			const learningPathData = await Promise.all(
				learningpaths.map(async (path: string) => {
					const res = await apiRequest(`${path}?language=${language}`, "get");
                    res.url = path; // Add the URL to the response
					return res;
				})
			);

			learningPaths = learningPathData;
		} catch (error) {
			console.error("Error fetching learning paths:", error);
		}
	}

	// Search bar
	$: searchProducts = learningPaths.map((learningPath) => ({
      ...learningPath,
      searchTerms: `${learningPath.name} ${learningPath.description}`
    }));

	let searchStore = createSearchStore<LearningPath & { searchTerms: string }>([]);

	$: if (searchProducts.length) {
        searchStore.set({
          data: searchProducts,
          filtered: searchProducts,
          search: $searchStore?.search || ""
        });
      }

	const unsubscribe = searchStore.subscribe((model) => searchHandler(model));
    onDestroy(unsubscribe);
    onMount(() => {
      fetchLearningPaths(get(currentLanguage));
    });

	// Update learning paths when the language changes
	$: fetchLearningPaths($currentLanguage);
</script>

<div class="learning-paths">
	
	<div class="search-box">
		<input class="input-search" type="search" placeholder={$currentTranslations.searchBar.placeholder} bind:value={$searchStore.search} />
	</div>

	  {#if $searchStore.filtered}
    	<!-- Learning paths -->
		{#each $searchStore.filtered as learningPath}
			<button 
				type="button"
				class="learning-path {$chosenLearningPath === learningPath ? 'selected' : ''}" 
				on:click={() => selectLearningPath(learningPath)}
				aria-label={`Select learning path: ${learningPath.name}`}>
			<div class="header">
				<img src={"../static/images/learning_path_img_test.jpeg"} alt="Learning path icon" />
				<!-- <img src={learningPath.img} alt="Learning path icon" /> -->
				<h1>{learningPath.name}</h1>
			</div>
		
			<div class="content">
				<p>{learningPath.description}</p>
			</div>
			</button>
		{/each}
	  {:else}
		<li>No learning paths found</li>
	  {/if}
</div>

<style>
    .learning-paths {
		flex: 1; /* Each column takes equal space */
		display: flex;
		flex-direction: column; /* Stack content vertically */
		gap: 5px; /* Spacing between items */
		border-radius: 15px;
		border: 15px solid var(--dwengo-green);
	}

    .learning-path {
        margin: 7px;
        padding: 20px;
        border: none;
        background-color: transparent;
    }

    .selected {
        background-color: var(--dwengo-dark-green);
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
    }

    img {
		width: 100px;
		height: 100px;
	}

	.header {
	display: flex;
	align-items: center; /* Aligns image and text vertically */
	gap: 15px; /* Space between image and text */
	}

	.content {
		display: flex;
		flex-direction: column;
		padding-top: 10px;
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
