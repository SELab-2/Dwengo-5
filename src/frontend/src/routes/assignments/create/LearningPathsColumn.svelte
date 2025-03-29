<script lang="ts">
	import { onMount } from "svelte";
	import { currentLanguage } from "../../../lib/locales/i18n";
	import SearchBar from "../../../lib/components/features/SearchBar.svelte";
	import "../../../lib/styles/global.css";
	import { apiBaseUrl } from "../../../config";
	import { apiRequest } from "../../../lib/api";
	import { user } from "../../../lib/stores/user.ts";
	import { params } from 'svelte-spa-router';
    import { chosenLearningPath } from "../../../lib/stores/createAssignment.ts"; // Import store
    import { get } from "svelte/store";
	
	// Learning paths

	type LearningPath = {
		img: string;
		name: string;
		description: string;
		content: string;
		url: string;
	};

	// Selected learning path

	function selectLearningPath(path: LearningPath) {
		chosenLearningPath.set(path);
    	}


	// All learning paths
	// TODO: shared function
	let learningPaths: LearningPath[] = [];
	
	async function fetchLearningPaths(language: string) {
		try {
			// Fetch learning path urls
			const response = await apiRequest(`/learningpaths?language=${language}`, "get");
			const learningpaths = response.learningpaths;	

			// Fetch all learning paths
			const learningPathData = await Promise.all(
				learningpaths.map(async (path: string) => {
					const res = await apiRequest(`${path}?language=${language}`, "get");
					return res;
				})
			);

			learningPaths = learningPathData;
		} catch (error) {
			console.error("Error fetching learning paths:", error);
		}
	}


	$: {
		fetchLearningPaths($currentLanguage);
	}
</script>

<div class="learning-paths">
    <SearchBar />

    <!-- Learning paths -->
    {#each learningPaths as path}
        <button 
            type="button"
            class="learning-path {$chosenLearningPath === path ? 'selected' : ''}" 
            on:click={() => selectLearningPath(path)}
            aria-label={`Select learning path: ${path.name}`}>
            <div class="header">
                <img src={"../static/images/learning_path_img_test.jpeg"} alt="Learning path icon" />
                <!-- <img src={path.img} alt="Learning path icon" /> -->
                <h1>{path.name}</h1>
            </div>
        
            <div class="content">
                <p>{path.description}</p>
            </div>
        </button>
    {/each}
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
</style>
