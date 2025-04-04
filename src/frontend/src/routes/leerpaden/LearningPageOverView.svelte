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

    let learningpathUrls = null
    let names = []
    let descriptions = []
    let learningpaths = []
    type learninpathInfo = {
        name: String;
        description: String;
    }

    async function getLearnpathUrl(){
        try{
            const  response = await apiRequest(`/learningpaths?language=en`, "get");
            console.log(response)
            learningpathUrls = response.learningpaths
        }
        catch(error){
            console.log(error)
            console.error("Error fetching learningpaths")
        }
    }

    async function getLearnpath(){
        try{
            for(let url of learningpathUrls){
                const response = await apiRequest(`${url}`, "get");
                names = names.concat(response.name)
                descriptions = descriptions.concat(response.description)
                learningpaths = learningpaths.concat(response);
            }
        }
        catch(error){
            console.log(error)
            console.error("Error fetching learnpath")
        }
    }

    onMount(async () => {
        await getLearnpathUrl()
        await getLearnpath()
        console.log(learningpathUrls)
    });
</script>

<Header></Header>
<h1>Mijn leerpaden</h1>
<div class="learning-path-container">
    {#each learningpathUrls as url, index}
      <div class="card">
        <div class="card-content">
          <h3>{names[index]}</h3>
          <p>{descriptions[index]}</p>
          <button class="btn" on:click={() => routeTo(url.slice(1))}>
            Go to {names[index]}
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