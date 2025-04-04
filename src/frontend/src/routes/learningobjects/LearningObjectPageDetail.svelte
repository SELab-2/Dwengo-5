<script lang=ts>
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

    $: translatedBack = $currentTranslations.learningobject.back
    $: translatedTime = $currentTranslations.learningobject.time

    let url = window.location.href;
    let id = url.split("/").pop();
    let index = id.indexOf("?role");
    let name = ""
    let time = ""
    if (index !== -1) {
        id = id.slice(0, index); 
    }
    let learnpathid = url.split("/")[5]
    let learningobject = null;
    let content_url = ""
    let content = null
    async function getlearningObject(){
        try{
            const response = await apiRequest(`/learningobjects/${id}`, "get")
            console.log(response)
            learningobject = response
            name = response.name
            time = response.estimated_time
            content_url = learningobject.links.content
        }
        catch(error){
            console.error("Error fetching learningobject")
        }
    }

    async function getContent(){
        try{
            console.log(content_url)
            const response = await apiRequest(`${content_url}`, "get")
            console.log(response)
            content = response.htmlContent
        }
        catch(error){
            console.error("Error fetching content of learningobject")
        }
    }

    onMount(async () => {
        await getlearningObject()
        await getContent()
        console.log(learnpathid.slice(1))
    });
</script>
<Header></Header>
  
<div class="learningpath-card">
    <a class="back-link" on:click={() => routeTo(`learningpaths/` + learnpathid)}>
      &larr; {translatedBack}
    </a>
  
    <div class="card-content">
      <h2>{name}</h2>
      <p><strong>{translatedTime}:</strong>  mins</p>
      <p>{content}</p>
    </div>
  </div>
  
  <style>
    .learningpath-card {
      max-width: 600px;
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
  </style>
  