<script lang="ts">
  import { onMount } from "svelte";
  import Header from "../../lib/components/layout/Header.svelte";
  import { currentTranslations } from "../../lib/locales/i18n";
  import Footer from "../../lib/components/layout/Footer.svelte";
  import Drawer from "../../lib/components/features/Drawer.svelte";
  import "../../lib/styles/global.css";
  import { apiBaseUrl } from "../../config";

  // Fetch learning paths
  let learningPaths = [];

  onMount(async () => {
    try {
      //const language = 
      //console.log(language);

      //const response = await fetch(`${apiBaseUrl}/learningpaths?language=${language}`);

      const response = await fetch(`${apiBaseUrl}/learningpaths?language=en`);
      const { learningpaths } = await response.json();

      // Fetch all learning path data in parallel
      const learningPathData = await Promise.all(
        learningpaths.map(async (path) => {
          const res = await fetch(`${apiBaseUrl}${path}?language=en`);
          return res.json();
        })
      );

      learningPaths = learningPathData;
    } catch (error) {
      console.error("Error fetching learning paths:", error);
    }
  });


</script>

<main>
  <Header name={"test"} role={"student"} />
  <div class="container">
      <div class="title-container">
        <p class="title">Onze <span class="green-text">lesthema's</span></p>
      </div>

      <div class="bottom">
          <div class="drawer-container">
            <Drawer navigation_items={["assignments", "questions", "classrooms", "catalog"]} active="catalog" />
          </div>

          <div class="catalog-content">
            <ul>
              {#each learningPaths as learningPath}
              <li>
                <div class="header">
                  <img src={learningPath.img} alt="Learning path icon" />
                  <h1>{learningPath.name}</h1>
                </div>

                <div class="content">
                  <p>{learningPath.description}</p>
                  <a href={learningPath.content}>Lees meer></a> <!-- Link to learning path page & translate-->
                </div>
              </li>
            {/each}
            </ul>
          </div>
      </div>
  </div>
  
  <Footer />
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
    margin-left: 80px;
    margin-right: 80px;
    margin-top: 30px;
    border-radius: 15px;
    border: 15px solid var(--dwengo-green);
    padding-left: 30px;
    padding-right: 30px;
    padding-top: 10px;
    padding-bottom: 10px;
    
  }

  li {
    font-family: 'C059-Italic'; 
    list-style-type: none;
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
  .green-text {
    color: var(--dwengo-green); /* Makes "lesthema's" green */
  }

  /* styling per catalog item */
  .header {
    display: flex;
    align-items: center; /* Aligns image and text vertically */
    gap: 15px; /* Adds space between image and text */
    margin-bottom: 10px;
  }

  .content {
    display: flex;
    flex-direction: column;
    padding-left: 15px;
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

  a {
  display: inline-block; /* Ensures margin applies properly */
  margin-top: 20px; /* Adjust as needed */
  font-family: sans-serif;
  font-size: 0.8rem;
  text-decoration: none; /* Removes underline */
}
</style>