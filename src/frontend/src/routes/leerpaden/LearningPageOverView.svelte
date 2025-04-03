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

<p>{JSON.stringify(learningpaths)}</p>
{#each learningpathUrls as url, index }
    <p>{JSON.stringify(learningpaths[index])}</p>
    <p>{names[index]}</p>
    <p>{descriptions[index]}</p>
    <a class="link" on:click={() => routeTo(url.slice(1))}>go</a>
{/each}
<p>{learningpathUrls}</p>