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


    onMount(async () => {
        await getLearnpath()
        await getContent()
        
        
    });
    
</script>

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