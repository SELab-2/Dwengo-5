<script lang='ts'>
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
    import { linear } from "svelte/easing";
    import { routeTo } from '../../lib/route.ts';
    
    $: translatedTitle = $currentTranslations.learningobjects.subject;
    $: translatedTime = $currentTranslations.learningobjects.time;
    $: translatedLanguage = $currentTranslations.learningobjects.language;
    $: translatedDiffcultie = $currentTranslations.learningobjects.difficultie;
    $: translatedLink = $currentTranslations.learningobjects.link;

    // Get the dynamic ID from the URL
    //$: id = $page.params.id;
    let url = window.location.href;
    let id = url.split("/").pop();
    let index = id.indexOf("?role");
    if (index !== -1) {
        id = id.slice(0, index);
    }
    let leerpad = null;
    let name = "";
    let content = "";
    let image = null;
    let description = "";
    let links = "";
    let learningobjectLinks = [];
    let metadata: data[] = [];

    let data = null;
    let loading = true;

    type data = {
        time: number;
        title: String;
        difficulty: number;
        language: String;
    }
    ///learningpaths/550e8400-e29b-41d4-a716-446655440000
    async function getLearnpath() {
        try {
            const response = await apiRequest(`/learningpaths/${id}`, "GET");
            leerpad = response;
            name = leerpad.name;
            image = leerpad.image;
            description = leerpad.description;
            links = leerpad.links.content;
        } catch(error) {
            console.error("Error fetching Learnpath");
            console.log(error);
        }
    }

    async function getContent(){
        try {
            content = await apiRequest(`${links}`, "GET");
            learningobjectLinks.concat(response.learningobject);
            for(let i = 0; i < response.length; i++) {
              learningobjectLinks = learningobjectLinks.concat(response[i].learningobject);
            }
        } catch(error) {
            console.error("Error fetching content.");
        }
    }

    async function getMetadata(){
        try {
            for(let url of learningobjectLinks){
                const response = await apiRequest(`${url}/metadata`, "GET");
                const q: data = {
                    title: response.metaData.title,
                    time: response.metaData.estimated_time,
                    language: response.metaData.language,
                    difficulty: response.metaData.difficulty,
                };
                metadata = metadata.concat(q);
            }
            loading = false;
        } catch(error) {
            console.error("Error fetching metadata");
        }
        
        
    }

    onMount(async () => {
        await getLearnpath();
        await getContent();
        await getMetadata();
    });

</script>

{#if loading}
  <p>{$currentTranslations.learningpath.loading}...</p>
{:else}
<Header />
<h1>{description}</h1>
<div class="container">
<div class="side-panel">
    
    {#each learningobjectLinks as link, index}
      <div class="card">
        <p><strong>{translatedTitle}:</strong> {metadata[index].title}</p>
        <p><strong>{translatedTime}:</strong> {metadata[index].time}'</p>
        <button class="link" on:click={() => routeTo(`/learningpaths/` + id + link)}>{translatedLink}</button>
      </div>
    {/each}
  </div>
  <div class="content">
    <h3>{name}</h3>
    <p>{description}</p>
  </div>
</div>
{/if}

  
<style>
    .side-panel {
      width: 300px;
      background-color: #f0fff0;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
      overflow-y: auto;
      border: 10px solid var(--dwengo-green);
      border-radius: 12px;
      padding: 16px;
    }
    .card {
      background-color: lightgreen;
      padding: 1rem;
      margin-bottom: 10px;
      border-radius: 6px;
      box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
    }
    .card p {
      margin: 5px 0;
    }

    .container {
    display: flex;
    gap: 20px;
    }
  .content {
    flex-grow: 1;
    padding: 1rem;
  }

  .link {
        color: black; 
        text-decoration: none;
        font: inherit; 
        padding: none;
    }


</style>