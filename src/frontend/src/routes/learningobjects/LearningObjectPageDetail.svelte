<script lang=ts>
    import { onMount, onDestroy, afterUpdate } from "svelte";
	import {location} from 'svelte-spa-router';
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
    

    $: translatedBack = $currentTranslations.learningobject.back
    $: translatedTime = $currentTranslations.learningobject.time

    $: translatedTitle = $currentTranslations.learningobjects.subject
    $: translatedTime = $currentTranslations.learningobjects.time
    $: translatedLanguage = $currentTranslations.learningobjects.language
    $: translatedDiffcultie = $currentTranslations.learningobjects.difficultie
    $: translatedLink = $currentTranslations.learningobjects.link

    let url;
    let id;
    let loading = true;
    let index;
    let learnpathid;
    
    let name = ""
    let time = ""
    
    let learningobject = null;
    let contentUrl = ""
    let content = null
    let leerpad = null 
    let leerpadlinks = []
    let contentLearnpath = null
    let learningobjectLinks = []
    let learnpathName = ""
    let progress = 0
    let total = 0

    let metadata: data[] = []
    

    type data = {
        time: number;
        title: String;
        difficulty: number;
        language: String;
    }

    async function getlearningObject(){
        try{
            const response = await apiRequest(`/learningobjects/${id}`, "get")
            
            learningobject = response
            name = response.name
            time = response.estimated_time
            contentUrl = learningobject.links.content
        }
        catch(error){
            console.error("Error fetching learningobject")
        }
    }

    async function getLearnpath(){
        try{
            
            const response = await apiRequest(`/learningpaths/${learnpathid}`, "get")
            leerpad = response
            leerpadlinks = leerpad.links.content
            learnpathName = response.name
        }
        catch(error){
            console.error("Error fetching Learnpath")
            
        }
    }

    async function getContentLearnpath(){
        try{
            const response = await apiRequest(`${leerpadlinks}`, "get")
            contentLearnpath = response
            learningobjectLinks.concat(response.learningobject)
            for(let i = 0;i<response.length;i++){
                learningobjectLinks = learningobjectLinks.concat(response[i].learningobject)
                if(id === learningobjectLinks[i].split("/").pop()){
                    progress = i + 1
                }
            }
            total = learningobjectLinks.length 
        }catch(error){
            console.error("Error fetching content.")
        }
    }

    async function getMetadata(){
        try{
            for(let url of learningobjectLinks){
                const response = await apiRequest(`${url}/metadata`, "get")
                const q: data = {
                    title: response.metaData.title,
                    time: response.metaData.estimated_time,
                    language: response.metaData.language,
                    difficulty: response.metaData.difficulty,
                };
                metadata = metadata.concat(q)
            }
            loading = false
        }catch(error){
            console.error("Error fetching metadata");
        }
        
        
    }

    async function getContent(){
        try{
			if(!contentUrl) return;
            const response = await apiRequest(`${contentUrl}`, "get")
            content = response.htmlContent
        }
        catch(error){
            console.error("Error fetching content of learningobject")
        }
    }

	// Watch for changes in the `id` variable and update `name` and `content` reactively
	function getUrls() {
		const url = window.location.href;
		id = url.split("/").pop()?.split("?")[0];
		learnpathid = url.split("/")[5];
	}

	$: {
		id = $location.split("/").pop()?.split("?")[0];
		
		if (id) {
			(async () => {
				await getlearningObject();
				await getContent();
			})();
		}
	}	

	onMount(async () => {
		getUrls();

		await getLearnpath();
		await getContentLearnpath();
		await getMetadata();
		await getContent();
		await getlearningObject();

		console.log("metadata", metadata);
		console.log("learningobjectLinks", learningobjectLinks);
	});
</script>


{#if loading}
  <p>Loading...</p>
{:else}
<Header></Header>
<h1>{learnpathName}</h1>
<p>{id}</p>
<p>{url}</p>
<div class="container">
    
    <div class="side-panel">
      {#each learningobjectLinks as link, index}
        <div class="card">
          <p><strong>{translatedTitle}:</strong> {metadata[index].title}</p>
          <p><strong>{translatedTime}:</strong> {metadata[index].time}'</p>
          <button class="link" on:click={() => routeTo(`learningpaths/` + learnpathid + link)}>{translatedLink}</button>
        </div>
      {/each}
    </div>
  
    
    
    <div class="learningpath-card">
        <h2>Progresbar</h2>
        <div class="progress-wrapper">
        <span>0</span>
        <div class="progress-container">
            <div class="progress-bar" style="width: {progress/total *100}%"></div>
        </div>
        <span>100%</span>
        </div>
      
      <div class="card-content">
        <h2>{name}</h2>
        <p>{content}</p>
      </div>
    </div>
  </div>
  
  {/if}
  
  <style>
    .learningpath-card {
      flex: 2;
      max-width: 1200px;
      margin: 40px auto;
      padding: 20px;
      border-radius: 16px;
      background-color: #e6f4ea; /* light green */
      box-shadow: 0 4px 12px rgba(0, 128, 0, 0.15); /* soft green shadow */
      font-family: sans-serif;
    }
  
    .back-link {
      color: #006400;
      text-decoration: none;
      font-weight: bold;
      display: inline-block;
      margin-bottom: 20px;
    }
  
    .back-link:hover {
      text-decoration: underline;
    }
  
    .card-content h2 {
      color: #2e8b57;
      margin-bottom: 10px;
    }
  
    .card-content p {
      font-size: 1rem;
      color: #333;
      margin-bottom: 10px;
    }

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

    .container {
        display: flex;
        gap: 5px;
        padding: 5px;
    }

 .progress-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

.progress-container {
  flex: 1;
  height: 14px;
  background-color: #f0f4f8;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.progress-bar {
  height: 100%;
  background-color: #9bea4c; /* bright green */
  border-radius: 10px 0 0 10px;
  transition: width 0.3s ease;
}
  </style>
