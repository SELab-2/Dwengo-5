<script lang="ts"> 
    import Header from "../../../../../../../../lib/components/layout/Header.svelte";
    import Footer from "../../../../../../../../lib/components/layout/Footer.svelte";
    import BackButton from "../../../../../../../../lib/components/ui/BackButton.svelte";
    
    import { onMount } from "svelte";
    import { apiRequest } from "../../../../../../../../lib/api";
    import { routeTo } from "../../../../../../../../lib/route.ts";
    import { formatDate } from "../../../../../../../../lib/utils.ts";
    import { currentTranslations } from "../../../../../../../../lib/locales/i18n";
    import type { Submission } from "../../../../../../../../lib/types/types.ts";

    function getQueryParamsURL() {
        const urlParams = new URLSearchParams(window.location.search);
        let role = urlParams.get('role') || "";
        let id = urlParams.get('id') || "";

        return {
			role: role,
			id: id,
        };
    }
    
    let loading = true;
    let role = getQueryParamsURL().role;
    let id = getQueryParamsURL().id;

    let url = window.location.pathname;
    console.log(url)
    let assignmentId = url.split('/')[4]
    let groupId = url.split('/')[6]
    console.log(url.split('/'))
    console.log(groupId)
    let classId = url.split('/')[2]
    let assignment = null;
    let assignmentName = "";
    let deadline = "";
    let group = null;
    let classroom = null;
    let classroomName = "";

    
    $: translatedStatus = $currentTranslations.assignmentDashboard.status;
    $: translatedLearningobject = $currentTranslations.assignmentDashboard.learningobject;
    $: translatedGrade = $currentTranslations.assignmentDashboard.grade;
    $: translatedWrong = $currentTranslations.assignmentDashboard.wrong;
    $: translatedApproved = $currentTranslations.assignmentDashboard.approved;
    $: translatedClassroom = $currentTranslations.submissionDetail.classroom;
    $: translatedGroup = $currentTranslations.submissionDetail.group;
    $: translatedSubmission = $currentTranslations.submissionDetail.submission;
    $: translatedFor = $currentTranslations.submissionDetail.for;
    $: translatedGrade = $currentTranslations.submissionDetail.grade;
    $: translatedUpdate = $currentTranslations.submissionDetail.update;
    $: translatedContent = $currentTranslations.submissionDetail.content;
    $: translatedSubmissions = $currentTranslations.submissionDetail.submissions;
    $: translatedEmpty = $currentTranslations.submissionDetail.empty;


    let submissions: Submission[] = [];

    async function fetchAssignment() {
        try {
			const response =  await apiRequest(`/classes/${classId}/assignments/${assignmentId}`, "GET");
            assignment = response;
            assignmentName = assignment.name;
            deadline = formatDate(assignment.deadline);
        } catch(error){
            console.error("Error fetching assignment");
        }
    }

    async function fetchGroup() {
        try {
            const response = await apiRequest(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}`, "GET");
            group = response;
        } catch(error) {
            console.error("Error fetching groups: " + error);
        }
    }

    async function fetchClass() {
        try {
            const response = await apiRequest(`/classes/${classId}`, "GET");
            classroom = response;
            classroomName = response.name;
           
        } catch (err) {
            console.error("Failed to fetch classrooms.");
        }
    }

    async function fetchLearningObject(learningObjectId: string){
        try {
            const response = await apiRequest(`/learningobjects/${learningObjectId}`, "GET");
			return response.name;
        } catch(error){
            console.error("Error fetching learningobject");
        }
    }

    async function fetchSubmissions(){
        try{
            console.log(`/users/${id}/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/submissions`)
            const response = await apiRequest(`/users/${id}/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/submissions`, "GET");
            for(let sub of response.submissions){
                let learningobjectName = await fetchLearningObject(sub.learning_object_id);
                const q: Submission = {
                    id: sub.id,
                    grade: sub.grade,
                    learningobject: learningobjectName,
				};
                submissions = submissions.concat(q);
            }
        } catch(error){
            console.error("Error fetching submissions: " + error);
        }
    }

    onMount(async () => {
        await fetchAssignment();
        await fetchClass();
        await fetchGroup();
        await fetchSubmissions();
    });


</script>

<Header></Header>
<div class ="content-wrapper">
    <div class="title-container">
        <h1 class="title">{translatedSubmission} {translatedFor}: <span style="color:#80cc5d">{assignmentName}</span></h1>
        <h2>{$currentTranslations.assignment.deadline}: <span style="color:#80cc5d">{deadline}</span></h2>
        <h2>{translatedClassroom}: <span style="color:#80cc5d">{classroomName}</span></h2>
        <h2>{translatedGroup}: <span style="color:#80cc5d">{groupId}</span></h2>
    </div>
    <h2 class="submission-title">{translatedSubmissions}</h2>
    <div class="submission-card">
        <div class="top-section">
            {#if submissions.length === 0}
                <div class="no-messages">{translatedEmpty}</div>
            {:else}
                <section class="card">
                
                    <div class="submission-table">
                        
                        <div class="submission-header">
                            <p>{translatedGrade}</p>
                            <p>{translatedLearningobject}</p>
                            <p>#</p>
                            <p>{translatedStatus}</p>
                        </div>
                    
                        <div class="submission-scroll">
                            {#each submissions as submission, index}
                                <div class="submission-row">
                                    <p>{submission.grade * 100}%</p>
                                    <p>{submission.learningobject}</p>
                                    <button on:click|preventDefault={() => {routeTo(`/classrooms/${classId}/assignments/${assignmentId}/groups/${groupId}/submissions/${submission.id}`);}} class="text-button">{index+1}</button>
                                    {#if submission.grade > 0.5}
                                        <p style = "color: var(--dwengo-green)">{translatedApproved}</p>
                                    {:else}
                                        <p style = "color: red">{translatedWrong}</p>
                                    {/if}
                                </div>
                            {/each}
                        </div>
                    </div>
                </section>
            {/if}
        </div>
    </div>
</div>
<Footer></Footer>

<style>

.text-button {
    background: none;
    border: none;
    padding: 0;
    font: inherit;
    color: #0077cc;
    cursor: pointer;
    text-decoration: underline;
    width: 5%;
  }

  .text-button:hover {
    text-decoration: none;
    color: #005fa3;
  }

  .text-button:focus {
    outline: none;
    text-decoration: underline;
    color: #003f7f;
  }

.content-wrapper {
    overflow-y: auto;
    border: 1px solid #ccc;
    padding: 1rem;
}

.submission-card {
		flex: 1;
		border-radius: 16px;
		box-shadow: 0 4px 12px rgba(0, 128, 0, 0.15); /* soft green shadow */
		font-family: sans-serif;
		border-radius: 15px;
		background-color: white;
		border: 15px solid var(--dwengo-green);
		padding: 20px;
		overflow-y: auto;
  		min-height: 700px; /* You can adjust the min-height as needed for a bigger card */
}

.submission-title {
        padding-top: 5%;
		font-size: 2rem;
		margin-bottom: 20px;
	}


    .submission-table {
        width: 100%;
        border: 1px solid #ccc;
        border-radius: 8px;
        font-family: sans-serif;
        background-color: #fff;
        overflow: hidden;
        margin-top: 1rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    }

    .submission-header {
        display: grid;
        grid-template-columns: 1fr 1fr 2fr 1fr 1fr;
        background-color: #f2f2f2;
        padding: 0.75rem;
        font-weight: bold;
        border-bottom: 1px solid #ccc;
    }

    .submission-scroll {
        max-height: 300px; 
        overflow-y: auto;
    }

    .submission-row {
        display: grid;
        grid-template-columns: 1fr 1fr 2fr 1fr 1fr;
        padding: 0.75rem;
        border-bottom: 1px solid #eee;
    }

    .submission-row p {
        margin: 0;
        word-break: break-word;
    }

</style>