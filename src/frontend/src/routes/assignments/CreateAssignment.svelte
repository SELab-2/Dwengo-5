<script lang="ts">
    import { onMount } from "svelte";
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
  
    
  
    $: translatedTitle = $currentTranslations.assignments.title
  
    type LearningPath = {
      img: string;
      name: string;
      description: string;
      content: string;
    };
  
    let learningPaths: LearningPath[] = [];
  
    // TODO: shared function
    async function fetchLearningPaths(language: string) {
      try {
        // Fetch learning path urls
        const { learningpaths } = await apiRequest(`/learningpaths?language=${language}`, "get");
  
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
          <p class="title">Klas: </p>
        </div>
  
        <div class="bottom">
            <div class="drawer-container">
              <Drawer navigation_items={["members", "assignments"]} active="assignments" />
            </div>
  
            <div class="assignment-content">

              <div class="learning-paths">
                <!-- Content for column 1 -->

                <!-- Searchbar -->

                <!-- Learning paths -->
                {#each learningPaths as path}
                  <div class = "learning-path">
                    <div class="header">
                      <img src={"../static/images/learning_path_img_test.jpeg"} alt="Learning path icon" />
                      <!-- <img src={path.img} alt="Learning path icon" /> -->
                      <h1>{path.name}</h1>
                    </div>
    
                    <div class="content">
                      <p>{path.description}</p>
                    </div>
                  </div>
                {/each}
              </div>
              <div class="students">
                <!-- Content for column 2 -->
              </div>
              <div class="groups">
                <!-- Content for column 3 -->
              </div>
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
    .assignment-content {
      display: flex;
      gap: 20px; /* Spacing between columns */
      width: 100%;
      padding: 20px;
    }

    .learning-paths, .students, .groups {
      flex: 1; /* Each column takes equal space */
      display: flex;
      flex-direction: column; /* Stack content vertically */
      gap: 20px; /* Spacing between items */
      /* background-color: var(--dwengo-green);*/
      border-radius: 15px;
      border: 15px solid var(--dwengo-green);
    }

    .learning-path {
      padding: 20px;
    }
  
    .title {
      font-family: 'C059-Roman';
      font-size: 4rem;
      justify-content: top; /* Center vertically */
    }
  
    p {
      font-family: sans-serif;
      font-size: 1.1rem;
    }

    img {
      width: 100px;
      height: 100px;
    }

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

  img {
    width: 100px; /* Adjust size as needed */
    height: 100px;
  }    
  </style>