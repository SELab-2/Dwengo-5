<script lang="ts">
    import Header from "../../../../lib/components/layout/Header.svelte";
    import Footer from "../../../../lib/components/layout/Footer.svelte";
    import Drawer from "../../../../lib/components/features/Drawer.svelte";
    import BackButton from "../../../../lib/components/ui/BackButton.svelte";
    import { currentTranslations } from "../../../../lib/locales/i18n";
    import { onMount } from "svelte";
    import { apiRequest } from "../../../../lib/api";
    import { routeTo } from "../../../../lib/route.ts";

    let url = window.location.href;
    let hashWithoutParams = window.location.hash.split("?")[0];
    let urlWithoutParams = hashWithoutParams.split("#")[1];

    $: translatedTitle = $currentTranslations.assignmentClassPage.title;
    $: translatedClass = $currentTranslations.groupsPage.class;
    $: translatedAssignment = $currentTranslations.groupsPage.assignment;
    $: translatedGroups = $currentTranslations.groupsPage.groups
    $: translatedNumber = $currentTranslations.groupsPage.number

    let assignmentId = urlWithoutParams.split("/")[4];
    let classId = urlWithoutParams.split("/")[2];
    let groupsUrls = [];
    let groupsIds = [];
    let assignment = null;
    let assignmentName = "";
    let className = ""

    async function fetchClass(){
        try{
            const response = await apiRequest(`/classes/${classId}`, "get");
            className = response.name
        }
        catch(error){
            console.error("Error fetching class: " + error)
        }
    }

    async function fetchAssignment(){
        try{
            const response = await apiRequest(`/classes/${classId}/assignments/${assignmentId}`, "get");
            assignmentName = response.name;
        }
        catch(error){
            console.error("Error fetching assignment: " + error);
        }
    }
    async function fetchGroups(){
        try{
            const response = await apiRequest(`/classes/${classId}/assignments/${assignmentId}/groups`, "get");
            groupsUrls = response.groups;
        }
        catch(error){
            console.error("Error fetching groups: " + error);
        }
    }

    async function fetchGroup(){
        try{
            for(let groupUrl of groupsUrls){
                groupsIds = groupsIds.concat(groupUrl.split("/").pop())
                const response = await apiRequest(`${groupUrl}`, "get")
                console.log(response)
            }
            groupsIds = groupsIds.concat(2)
        }
        catch(error){
            console.error("Error fetching one group: " + error)
        }
    }

    async function goTo(url){
        routeTo(`${url}/dashboard`)
    }

    onMount(async () => {
        await fetchGroups();
        await fetchGroup();
        await fetchAssignment();
        await fetchClass();
    });

</script>


<Header/>
<BackButton text={$currentTranslations.assignments.assignments}/>
<h1>{translatedClass}: <span style="color:#80cc5d">{className}</span> </h1>
<h2>{translatedAssignment}: <span style="color:#80cc5d">{assignmentName}</span></h2>
<h3>{translatedGroups}: </h3>
<div class="card-container">
    {#each groupsUrls as element, index}
        <div class="card">
            <p class="card-index">{translatedNumber}: {index + 1}</p>
            <a class="card-content" on:click={ async () => { goTo(element)}}> go to group</a>
        </div>
    {/each}
</div>

<!-- <p>{url}</p>
<p>{hashWithoutParams}</p>
<p>{urlWithoutParams}</p>
<p>{assignmentId}</p>
<p>{groupsIds}</p>
<p>{assignmentName}</p>
<p>{className}</p> -->

<style>
    .card {
        background-color: white;
        border-radius: 12px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        padding: 1rem;
        margin-bottom: 1rem;
        transition: transform 0.2s ease;
        width: 200px;
    }

    .card-container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        border: 15px solid var(--dwengo-green);
        border-radius: 15px;
    }

    .card:hover {
        transform: translateY(-2px);
    }

    .card-index {
        font-weight: bold;
        color: #555;
        margin-bottom: 0.5rem;
    }

    .card-content {
        color: #333;
        word-break: break-all;
    }
</style>
