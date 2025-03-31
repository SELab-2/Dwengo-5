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
    

    // Get the dynamic ID from the URL
    //$: id = $page.params.id;
    let url = window.location.href;
    let id = url.split("/").pop();
    let leerpad = null
    let name = ""
    let content = ""
    let image = null
    let description = ""
    let links = ""
    let learningobjectLinks = []
    let metadata: data[] = []

    let data = null;
    let loading = true;

    type data = {
        time: number;
        title: String;
        difficulty: number;
        language: String;
    }
    async function getLearnpath(){
        try{
            const response = await apiRequest(`/learningpaths/${id}`, "get")
            leerpad = response
            name = leerpad.name
            image = leerpad.image
            description = leerpad.description
            links = leerpad.links.content
        }
        catch(error){
            console.error("Error fetching Learnpath")
        }
    }

    async function getContent(){
        try{
            const response = await apiRequest(`${links}`, "get")
            content = response
            learningobjectLinks.concat(response.learningobject)
            for(let i = 0;i<response.length;i++){
                learningobjectLinks = learningobjectLinks.concat(response[i].learningobject)
            }
        }catch(error){
            console.error("Error fetching content.")
        }
    }

    async function getMetadata(){
        try{
            for(let url of learningobjectLinks){
                const response = await apiRequest(`${url}/metadata`, "get")
                //console.log(response.metaData)
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


    onMount(async () => {
        await getLearnpath()
        await getContent()
        await getMetadata()
        console.log(metadata)
    });

    
    
</script>

{#if loading}
  <p>Loading...</p>
{:else}
<p>OOOOOOOOOOOOOOOOOOOOOOOO</p>
<p>{id}</p>
<p>{url}</p>
<p>{JSON.stringify(leerpad)}</p>
<p>{name}</p>
<p>{description}</p>
<p>{links}</p>
<p>{image}</p>
<p>{JSON.stringify(content)}</p>
<p>{learningobjectLinks}</p>
<p>{JSON.stringify(metadata)}</p>
<p>------------------------------</p>
{#each learningobjectLinks as link, index}
<p>{link}</p>
<p>{JSON.stringify(metadata[index])}</p>
 <p>{metadata[index].title}</p>
{/each}
{/if}