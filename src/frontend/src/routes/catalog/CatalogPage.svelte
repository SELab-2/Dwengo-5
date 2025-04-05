<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import Header from "../../lib/components/layout/Header.svelte";
    import { currentTranslations, savedLanguage, currentLanguage } from "../../lib/locales/i18n";
    import Footer from "../../lib/components/layout/Footer.svelte";
    import Drawer from "../../lib/components/features/Drawer.svelte";
    import "../../lib/styles/global.css";
    import { apiBaseUrl } from "../../config";
    import { apiRequest } from "../../lib/api";
    import { user } from "../../lib/stores/user.ts";
    import { get } from "svelte/store";
    import { push } from 'svelte-spa-router';
    import { createSearchStore, searchHandler } from "../../lib/stores/search.ts";
    

    $: translatedTitle = $currentTranslations.catalog.title
      .replace("{lesthema's}", `<span style="color:#80cc5d">lesthema's</span><br>`)
      .replace("{lessons}", `<span style="color:#80cc5d">lessons</span><br>`);

    type LearningPath = {
      img: string;
      name: string;
      description: string;
      content: string;
    };

    let learningPaths: LearningPath[] = [];
    let searchProducts: Array<LearningPath & { searchTerms: string }> = [];

    async function fetchLearningPaths(language: string) {
      try {
        // Fetch learning path urls
        const response = await apiRequest(`/learningpaths?language=${language}`, "get");
        const learningpaths = response.learningpaths;

        // Fetch all learning paths
        const learningPathData = await Promise.all(
          learningpaths.map(async (path: string) => {
            const res = await apiRequest(`${path}?language=${language}`, "get");
            res.url = path;
            return res;
          })
        );

        learningPaths = learningPathData;
      } catch (error) {
        console.error("Error fetching learning paths:", error);
      }
    }

    //This will search for a match of name/description in the learningPaths
    $: searchProducts = learningPaths.map((learningPath) => ({
      ...learningPath,
      searchTerms: `${learningPath.name} ${learningPath.description}`
    }));

    let searchStore = createSearchStore([]);
        
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

    $: {
      fetchLearningPaths($currentLanguage);
    }
  </script>

  <main>
    {#if user}
      <Header/>
      <div class="container">
        <div class="title-container">
          <p class="title">{ @html translatedTitle }</p>
        </div>

        <div class="bottom">
            <div class="drawer-container">
              <Drawer navigation_items={[($user.role === "teacher") ? "dashboard" : "assignments", "questions", "classrooms", "catalog"]} 
              navigation_paths={[($user.role === "teacher") ? "dashboard" : "assignments", "questions", "classrooms", "catalog"]}
              active="catalog" />
            </div>

            <div class="catalog-content">
				<div class="search-box">
              		<input class="input-search" type="search" placeholder="search..." bind:value={$searchStore.search} />
				</div>
              <ul>
                {#if $searchStore.filtered}
                  {#each $searchStore.filtered as learningPath}
                    <li>
                      <div class="header">
                        <img src={learningPath.img} alt="Learning path icon" />
                        <h1>{learningPath.name}</h1>
                      </div>

                      <div class="content">
                        <p>{learningPath.description}</p>
                        <p class="learning-path-link" on:click={push(`${learningPath.url}`)}>Lees meer></p>
                      </div>
                    </li>
                  {/each}
                {:else}
                  <li>No learning paths found</li>
                {/if}
              </ul>
            </div>
        </div>
    </div>
      <Footer />
    {:else}
      <p class="error">User data could not be loaded.</p>
    {/if}
  </main>

  <style>
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
    .drawer-container {
      flex: 0;
      display: flex;
      flex-direction: column;
      padding-top: 40px;
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
    }

    .title {
		font-family: 'C059-Roman';
		font-size: 4rem;
		justify-content: top; /* Center vertically */
    }

    /* styling per catalog item */
    .header {
		display: flex;
		align-items: center; /* Aligns image and text vertically */
		gap: 15px; /* Adds space between image and text */
    }

    .content {
		display: flex;
		flex-direction: column;
    }

    h1 {
		font-family: sans-serif;
		font-size: 1.8rem;
    }

    p {
		font-family: sans-serif;
		font-size: 1.1rem;
    }

    img {
		width: 100px; /* Adjust size as needed */
		height: 100px;
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