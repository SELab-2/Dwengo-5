<script lang="ts">
    //imports 
    import Header from "../../../lib/components/layout/Header.svelte";
    import BackButton from "../../../lib/components/ui/BackButton.svelte";
    import { currentTranslations } from "../../../lib/locales/i18n";
    import Drawer from "../../../lib/components/features/Drawer.svelte";
    import { onMount } from "svelte";
    import { apiRequest } from "../../../lib/api";
    import { routeTo } from "../../../lib/route.ts";

    export let className: string = "tempClassName";
    const navigation_items = ["assignments", "questions"];

    $: translatedTitle = $currentTranslations.assignmentClassPage.title
    $: translatedDeadline = $currentTranslations.assignmentClassPage.deadline
    $: translatedFurther = $currentTranslations.assignmentClassPage.further
   

    let url = window.location.href;
    let hashWithoutParams = window.location.hash.split("?")[0];
    let urlSplit = url.split("/");
    let classId = urlSplit[5]
    let classroomName = ""
    
    
    function getQueryParamsURL() {
        const hash = window.location.hash; // Get the hash part of the URL
        const queryParams = new URLSearchParams(hash.split('?')[1] || ''); // Extract the query parameters after '?'
        
        return {
        role: queryParams.get('role'),
        id: queryParams.get('id'),
        };
    }

    let assignmentUrls = []

    async function fetchStudentsClassAssignments(){
        try{
            const response = await apiRequest(`/students/${user_id}/classes/${classId}/assignments`, "get")
            assignmentUrls = response.assignments
        }catch(error){
            console.error("Error by fetching student class assignments")
        }
    }
    
    async function fetchTeacherClassAssignments(){
        try{
            const response = await apiRequest(`/classes/${classId}/assignments`, "get")
            assignmentUrls = response.assignments
        }
        catch(error){
            console.error("Error by fetching Teacher class assignment")
        }
    }

    let assignments: assignment[] = []

    type assignment = {
        deadline: String;
        name: String;
        learningpath: String;
    }
    async function fetchAssignments(){
        try{
            for(let a of assignmentUrls){
                const response = await apiRequest(`${a}`, "get")
                assignments = assignments.concat(response)
            }

        }
        catch(error){
            console.error("Error fetching assignments")
        }
    }
    async function fetchClass(){
        try{
            const response = await apiRequest(`/classes/${classId}`, "get")
            classroomName = response.name
        }
        catch(error){
            console.error("Error fetching class")
        }
    }
    let role = getQueryParamsURL().role
    let user_id = getQueryParamsURL().id
    

    onMount(async () => {
        await fetchClass()
        if(role === "student"){
            await fetchStudentsClassAssignments();
        }
        else{
            await fetchTeacherClassAssignments();
        }
        await fetchAssignments();
    });
    
</script>

<div>
    <Header/>
<div class="body">
    <BackButton text={$currentTranslations.assignments.classgroup}/>
    <div class="title-container">
        <h1>{translatedTitle}{classroomName}</h1>
        {#if role === "teacher"}
            <button class="button create-assignment" on:click={() => routeTo(`${hashWithoutParams}/create`)}>Create assignment</button>
        {/if}
    </div>


    <div class="content">
        <!-- Drawer Navigation -->
        <Drawer navigation_items={navigation_items} navigation_paths={navigation_items} active="assignments"/>

        <!-- Assignment Cards Container -->
        <div class="assignments-container">
            {#each assignments as assignment}
            <div class="assignment-card">
                <div class="card-content">
                    <h3>{assignment.name}</h3>
                    <p><strong>{translatedDeadline}:</strong> {assignment.deadline}</p>
                    <a href="#" class="read-more">{translatedFurther}</a> 
                </div>
            </div>
            {/each}
        </div>
    </div>
</div>
    
</div>

<style>
    .content {
        display: flex;         /* Enables flexbox */
        gap: 20px;             /* Adds spacing between elements */
        align-items: flex-start; /* Aligns items at the top */
    }

    .assignments-container {
        display: flex;
        flex-wrap: wrap;       /* Allows cards to wrap if needed */
        gap: 20px;             /* Spacing between cards */
        flex-grow: 1;         /* Ensures it takes remaining space */
    }

    .assignment-card {
        background: #fff;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        width: 300px; /* Adjust width as needed */
    }
  
    .card-content {
      padding: 15px;
    }
  
    .card-content h3 {
      color: var(--dwengo-green);
      margin-bottom: 5px;
    }
  
    .read-more {
      color: #000000;
      text-decoration: none;
      font-weight: bold;
    }

    .title-container {
        display: flex;
        justify-content: space-between; /* Ensures elements are spaced apart */
        align-items: center; /* Aligns items vertically */
    }

    .create-assignment {
        margin: 15px 0px;
        align-self: flex-end; /* Aligns the button to the right */
        margin-right: 70px; /* Adjusts the right margin */
    }
</style>