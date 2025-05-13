<script lang="ts"> 
    import Header from "../../lib/components/layout/Header.svelte";
    import Footer from "../../lib/components/layout/Footer.svelte";
    import BackButton from "../../lib/components/ui/BackButton.svelte";
    
    import { onMount } from "svelte";
    import { apiRequest } from "../../lib/api";
    import { routeTo } from "../../lib/route.ts";
    import { formatDate } from "../../lib/utils.ts";
    import { currentTranslations } from "../../lib/locales/i18n";


    function getQueryParamsURL() {
        const hash = window.location.hash; // Get the hash part of the URL
        const queryParams = new URLSearchParams(hash.split('?')[1] || ''); // Extract the query parameters after '?'
        return {
			role: queryParams.get('role'),
			id: queryParams.get('id'),
        };
    }
    
    let loading = true;
    let role = getQueryParamsURL().role;
    let id = getQueryParamsURL().id;

    let url = window.location.href;
    let hashWithoutParams = window.location.hash.split("?")[0];
    let urlWithoutParams = hashWithoutParams.split("#")[1];
    let assignmentId = urlWithoutParams.split('/')[4]
    let groupId = urlWithoutParams.split('/')[6]
    let classId = urlWithoutParams.split('/')[2]
    let submissionId = urlWithoutParams.split('/')[8]
    let assignment = null;
    let assignmentName = "";
    let deadline = "";
    let group = null;
    let classroom = null;
    let classroomName = "";
    let submissionContent = "";
    let grade: int = 0;
    let patchGradeContent = "";



    async function fetchAssignment() {
        try {
			const response =  await apiRequest(`/classes/${classId}/assignments/${assignmentId}`, "GET");
            assignment = response;
            assignmentName = assignment.name;
            deadline = formatDate(assignment.deadline);
        } catch(error){
            console.error("Error fetching assignment");
            console.log(error);
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

    async function fetchSubmission(){
        try{
            const response = await apiRequest(`/users/${id}/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/submissions/${submissionId}`, "GET");
            console.log(response.submissions[0]);
            grade = response.submissions[0].grade;
            submissionContent = response.submissions[0].submission_content;
            //submissionContent = response.
        } catch(error){
            console.error("Error fetching submissions: " + error);
        }
    }

    async function patchGrade(){
        try{
            const response = await apiRequest(`/users/${id}/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/submissions/${submissionId}`, "PATCH", {
				body: JSON.stringify({
						grade: grade,
						teacher: `/users/${id}`
					})
				});
        }
        catch(error){
            console.error("Error patching grade: " + error);
        }
    }

    onMount(async () => {
        await fetchAssignment();
        await fetchClass();
        await fetchGroup();
        await fetchSubmission();
    });

</script>

<Header></Header>
<div class="title-container">
    <h1 class="title">Submission for: <span style="color:#80cc5d">{assignmentName}</span></h1>
    <h2>{$currentTranslations.assignment.deadline}: <span style="color:#80cc5d">{deadline}</span></h2>
    <h2>Classroom: <span style="color:#80cc5d">{classroomName}</span></h2>
    <h2>Group: <span style="color:#80cc5d">{groupId}</span></h2>
    <h2>Grade: <span style="color:#80cc5d">{grade}</span></h2>
</div>
<h2 class="submission-title">Submission content</h2>
<div class="submission-card">
    <p>{submissionContent}</p>
</div>

{#if role === "teacher"}
    <h2 class="submission-title">Update Grade</h2>
    <div class="grade-card">
        <textarea bind:value={grade} placeholder="Place the new grade here (must be a number)" rows="1"></textarea>
        <button on:click={patchGrade}>Submit</button>
    </div>
{/if}

<Footer></Footer>

<style>
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

    .grade-card {
		flex: 1;
        border-radius: 16px;
        box-shadow: 0 4px 12px rgba(0, 128, 0, 0.15); /* soft green shadow */
        font-family: sans-serif;
        background-color: white;
        border: 15px solid var(--dwengo-green);
        padding: 20px;
        overflow-y: auto;
        width: 300px;
        min-height: 100px;
        position: absolute;
        right: 0;

        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .grade-card textarea,
    .grade-card button {
        display: block;
        width: 100%;
    }

    .submission-title {
        padding-top: 5%;
		font-size: 2rem;
		margin-bottom: 20px;
	}
</style>
