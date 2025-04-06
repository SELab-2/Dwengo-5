<script lang="ts">
    //imports 
    import Header from "../../../lib/components/layout/Header.svelte";
    import Footer from "../../../lib/components/layout/Footer.svelte";
    import Drawer from "../../../lib/components/features/Drawer.svelte";
    import BackButton from "../../../lib/components/ui/BackButton.svelte";
    import { currentTranslations } from "../../../lib/locales/i18n";
    import { onMount } from "svelte";
    import { apiRequest } from "../../../lib/api";
    import { routeTo } from "../../../lib/route.ts";

    const navigation_items = ["dashboard", "assignments"];

    $: translatedTitle = $currentTranslations.assignmentClassPage.title
    $: translatedDeadline = $currentTranslations.assignmentClassPage.deadline
    $: translatedFurther = $currentTranslations.assignmentClassPage.further
   
    let url = window.location.href;
    let hashWithoutParams = window.location.hash.split("?")[0];
    let urlWithoutParams = hashWithoutParams.split("#")[1];
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
        learningpathDescription?: String;
    }

    async function fetchAssignments() {
        try {
            for (let assignment of assignmentUrls) {
                const response = await apiRequest(`${assignment}`, "get");
                const learningPathResponse = await apiRequest(`${response.learningpath}`, "get");

                assignments = assignments.concat({
                    ...response,
                    url: assignment,
                    learningpathDescription: learningPathResponse.description,
                    image: learningPathResponse.image,
                });
            }
        } catch (error) {
            console.error("Error fetching assignments");
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

        console.log(assignments.length === 0)
    });

    function formatDate(dateString: string): string {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}-${month}-${year} ${hours}:${minutes}`;
    }

    async function goTo(url){
        const response = await apiRequest(`${url}`, "get")
        const learnpath = await apiRequest(`${response.learningpath}`, "get")
        const content = await apiRequest(`${learnpath.links.content}`, "get")
        routeTo(response.learningpath.slice(1) + content[0].learningobject)
    }
    
</script>

<div>
    <!-- TODO: let div shrink reactivly -->
    <Header/>
<div class="body">
    <BackButton text={$currentTranslations.assignments.classgroup}/>
    <div class="title-container">
        <h1>{translatedTitle} <span style="color:#80cc5d">{classroomName}</span> </h1>
    </div>


    <div class="content">
        <!-- Drawer Navigation -->
        <Drawer navigation_items={navigation_items} navigation_paths={[`classrooms/${classId}`, `classrooms/${classId}/assignments`]} active="assignments"/>

        <div class="assignments-content">
            {#if role === "teacher"}
                <button class="button create-assignment" on:click={() => routeTo(`${urlWithoutParams}/create`)}>{$currentTranslations.assignments.create}</button>
            {/if}

            <!-- Assignment Cards Container -->
            <div class="assignments-container">
                {#if assignments.length === 0}
                    <p class="no-assignments">{$currentTranslations.assignments.noAssignments}</p>
                {/if}
                {#each assignments as assignment}
                <div on:click={ async () => {   goTo(assignment.url)}} 
                class="assignment-card">
                        <div class="image-container">
                            <img class="image" src="../../static/images/learning_path_img_test2.jpeg" alt="learning-path" />
                          </div>
                        <!--<img src={assignment.image} alt="learning-path" />-->
                    <div class="card-content">
                    <div class="assignment-title">
                        <img class="icon" src="../../static/images/logo_test.png" alt="icon" /> <!-- TODO -->
                        <!--<img src={assignment.icon} alt="icon" />-->
                        <h3>{assignment.name}</h3>
                    </div>
                    <p><strong>{translatedDeadline}:</strong> {formatDate(assignment.deadline)}</p>
                    <p>{assignment.learningpathDescription}</p>
                    </div>
                </div>
            {/each}
          </div>
        </div>
    </div>
</div>

<Footer/>
    
</div>

<style>
    
    .content {
        display: flex;         /* Enables flexbox */
        gap: 20px;             /* Adds spacing between elements */
        align-items: flex-start; /* Aligns items at the top */
    }

    .assignments-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 20px 20px;
        justify-content: center; /* Centers cards in the container */

        background-color: white;
        border: 15px solid var(--dwengo-green);
        border-radius: 15px;

        padding: 20px;
        max-width: 1200px;    /* Optional max width to prevent full screen */
        margin: 0px auto;   /* Centers the container */
        overflow-y: auto; /* Enables vertical scrolling if needed */
        min-height: 700px; /* Ensures consistent size */
        max-height: 80vh;
        min-width: 1200px;
    }

    .assignment-card {
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        width: auto; /* Adjust width dynamically based on content */
        max-width: 350px; /* Optional: Set a maximum width */
        height: fit-content; /* Let it shrink to content */
    }
  
    .card-content {
      padding: 15px;
    }
  
    .card-content h3 {
      color: var(--dwengo-green);
    }

    .title-container {
        display: flex;
        justify-content: space-between; /* Ensures elements are spaced apart */
        align-items: center; /* Aligns items vertically */
    }

    .create-assignment {
        margin-bottom: 15px;
        align-self: flex-end;
    }

    .assignment-title {
        display: flex;
        direction: column;
        gap: 20px;
        align-items: center;
    }

    .icon {
        width: 60px;
        height: 60px;
    }

    .assignments-content {
        display: flex;
        flex-direction: column;
        margin: 0px auto;   /* Centers the container */
    }

    .image-container {
        width: 100%;
        display: flex;
        justify-content: center;
        margin-bottom: 10px;
    }

    .image {
        max-width: 350px;
        max-height: 350px;
        object-fit: contain;
        border-radius: 8px 8px 0 0; /* Top corners rounded, bottom corners regular */
    }

    .no-assignments {
        text-align: center;
        color: black;
        font-size: 1.2em;
        margin: auto; /* Centers the message */
    }

    h1 {
        margin: 0;
    }
</style>