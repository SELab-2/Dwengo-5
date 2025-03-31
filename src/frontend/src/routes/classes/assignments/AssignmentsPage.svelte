<script lang="ts">
    //imports 
    import Header from "../../../lib/components/layout/Header.svelte";
    import BackButton from "../../../lib/components/ui/BackButton.svelte";
    import { currentTranslations } from "../../../lib/locales/i18n";
    import Drawer from "../../../lib/components/features/Drawer.svelte";
    import { onMount } from "svelte";
    import { apiRequest } from "../../../lib/api";

    export let className: string = "tempClassName";
    const navigation_items = ["assignments", "questions"];

    let url = window.location.href;
    let url_split = url.split("/");
    let classId = url_split[5]
    
    
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
            console.log(response)
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
    
    let role = getQueryParamsURL().role
    let user_id = getQueryParamsURL().id
    

    onMount(async () => {
        if(role === "student"){
            await fetchStudentsClassAssignments();
            console.log(assignmentUrls)
        }
        else{

        }
        fetchAssignments();
    });
    
</script>

<div>
    <Header/>
    <div class="body">
        <BackButton text={$currentTranslations.assignments.classgroup}/>
        <h1>{$currentTranslations.assignments.class}: {className}</h1>
        <div class="content">
            <Drawer navigation_items={navigation_items} active="assignments"/>
            <p class="assignments">

            </p>
        </div>
    </div>
    {#each assignments as assignment}
    <div class="assignment-card">
      <div class="card-content">
        <h3>name</h3>
        <p><strong>deadline:</strong> {assignment.deadline}</p>
        <p>description</p>
        <a href="#" class="read-more">mmmm</a> 
      </div>
    </div>
  {/each}
</div>

<style>
    .content{
        display: flex;
        gap: 10px;
    }

    .assignments{
        border-color: var(--dwengo-green);
        border-width: 2px;
        width: 80%;
        height: 100px;
    }
</style>