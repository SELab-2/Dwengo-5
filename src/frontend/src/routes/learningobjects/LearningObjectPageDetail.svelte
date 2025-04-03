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

    let url = window.location.href;
    let id = url.split("/").pop();
    let index = id.indexOf("?role");
    if (index !== -1) {
        id = id.slice(0, index); 
    }
    let learnpathid = url.split("/")[5]
    let learningobject = null;
    let content_url = ""
    async function getlearningObject(){
        try{
            const response = await apiRequest(`/learningobjects/${id}`, "get")
            console.log(response)
            learningobject = response
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

<p>oooooooooooooooooooo</p>

<a class="link" on:click={() => routeTo(`learningpaths/` + learnpathid )}>go back</a>
<p>{url}</p>
<p>{id}</p>
<p>{learnpathid}</p>
<p>{JSON.stringify(learningobject)}</p>
<p>{JSON.stringify(content_url)}</p>