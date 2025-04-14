<script lang=ts>
    import { onMount } from "svelte";
    import Header from "../../lib/components/layout/Header.svelte";
    import { currentTranslations, savedLanguage, currentLanguage } from "../../lib/locales/i18n";
    import Footer from "../../lib/components/layout/Footer.svelte";
    import "../../lib/styles/global.css";
    import { apiRequest } from "../../lib/api";
    import { routeTo } from '../../lib/route.ts';

    let learningpathUrls: string[] = [];
    let names : string[] = [];
    let descriptions : string[] = [];
    let learningpaths : string[] = [];
    let learnpaths = [];
    let firstLearningObjects : string[] = [];

    let content : string[] = [];

    type learninpathInfo = {
        name: string;
        description: string;
    }

    async function getLearnpathUrl() {
        try {
            const  response = await apiRequest(`/learningpaths?language=en`, "GET");
            learningpathUrls = response.learningpaths;
        } catch(error) {
            console.error("Error fetching learningpaths");
        }
    }

    async function getLearnPaths(){
      try {
        for(let i in learningpathUrls) {
          const response = await apiRequest(`${learningpathUrls[i]}`, "GET");
          content = content.concat(response.links.content);
        }
      } catch(error) {
        console.log(error);
        console.error("Error fetching learnpath");
        
      }
    }

    async function getlearningObjectUrls(){
      try {
        for(let i in content) {
          const response = await apiRequest(`${content[i]}`, "GET");
          firstLearningObjects = firstLearningObjects.concat(response[0].learningobject);
        }
      } catch(error) {
        console.error("Error fetchin learningobjects");
        console.log(error);
      }
    }



    async function getLearnpath() {
        try {
            for(let url of learningpathUrls) {
                const response = await apiRequest(`${url}`, "GET");
                names = names.concat(response.name);
                descriptions = descriptions.concat(response.description);
                learningpaths = learningpaths.concat(response);
            }
        } catch(error) {
            console.log(error)
            console.error("Error fetching learnpath")
        }
    }

    onMount(async () => {
        await getLearnpathUrl();
        await getLearnpath();
        await getLearnPaths();
        await getlearningObjectUrls();
        
    });
</script>

<Header />
<h1>{$currentTranslations.learningpaths.my}</h1>
<div class="learning-path-container">
    {#each learningpathUrls as url, index}
      <div class="card">
        <div class="card-content">
          <h3>{names[index]}</h3>
          <p>{descriptions[index]}</p>
          <p>{url}</p>
          <button class="btn" on:click={() => routeTo(url + firstLearningObjects[index])}>
            {$currentTranslations.learningpaths.link} {names[index]}
          </button>
        </div>
      </div>
    {/each}
  </div>
  
  <style>
    .learning-path-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      padding: 20px;
    }
  
    .card {
      background: var(--dwengo-green);
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      padding: 20px;
      transition: transform 0.2s;
      text-align: center;
    }
  
    .card:hover {
      transform: translateY(-5px);
    }
  
    .card-content h3 {
      margin-bottom: 10px;
      font-size: 1.2rem;
    }
  
    .card-content p {
      font-size: 0.9rem;
      color: #555;
    }
  
    .btn {
      margin-top: 15px;
      padding: 8px 12px;
      border: none;
      background: white;
      color: black;
      font-size: 0.9rem;
      border-radius: 5px;
      cursor: pointer;
      transition: background 0.2s;
    }
  
    .btn:hover {
      background: #0056b3;
    }
  </style>