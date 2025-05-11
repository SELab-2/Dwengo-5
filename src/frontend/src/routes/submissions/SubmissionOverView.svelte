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
    let assignment = null;
    let assignmentName = "";
    let deadline = "";
    let group = null;
    let classroom = null;
    let classroomName = "";

    $: translatedName = $currentTranslations.assignmentDashboard.name;
    $: translatedTime = $currentTranslations.assignmentDashboard.time;
    $: translatedStatus = $currentTranslations.assignmentDashboard.status;
    $: translatedLearningobject = $currentTranslations.assignmentDashboard.learningobject;
    $: translatedGrade = $currentTranslations.assignmentDashboard.grade;
    $: translatedActivity = $currentTranslations.assignmentDashboard.activity;
    $: translatedStudents = $currentTranslations.assignmentDashboard.students;
    $: translatedMessages = $currentTranslations.assignmentDashboard.messages;
    $: translatedMessage = $currentTranslations.assignmentDashboard.message;
    $: translatedSender = $currentTranslations.assignmentDashboard.sender;
    $: translatedProgress = $currentTranslations.assignmentDashboard.progress;
    $: translatedWrong = $currentTranslations.assignmentDashboard.wrong;
    $: translatedApproved = $currentTranslations.assignmentDashboard.approved;
    $: translatedGroup = $currentTranslations.assignmentDashboard.group;


    const submissionOne: Submission = {
        grade: 1/4,
        time: "24/10/2025",
        learningobject: "Chapter 1 Algebra",
        amount: 1
    };

    const submissionSecond: Submission = {
        grade: 1/4,
        time: "25/10/2025",
        learningobject: "Chapter 1 Algebra",
        amount: 2
    };

    let submissions = [submissionOne, submissionSecond];

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

    onMount(async () => {
        await fetchAssignment();
        await fetchClass();
        await fetchGroup();
    });


</script>

<Header></Header>
<div class="title-container">
	<h1 class="title">Submissions for: <span style="color:#80cc5d">{assignmentName}</span></h1>
	<h2>{$currentTranslations.assignment.deadline}: <span style="color:#80cc5d">{deadline}</span></h2>
    <h2>Classroom: <span style="color:#80cc5d">{classroomName}</span></h2>
    <h2>Group: <span style="color:#80cc5d">{groupId}</span></h2>
</div>
<h2 class="submission-title">Submissions</h2>
<div class="submission-card">
    <div class="top-section">
        {#if submissions.length === 0}
            <div class="no-messages">No submissions available for this page.</div>
        {:else}
            <section class="card">
                <!-- <h2>{translatedActivity}</h2> -->
                
                <div class="submission-table">
                    
                    <div class="submission-header">
                        <p>{translatedGrade}</p>
                        <p>{translatedTime}</p>
                        <p>{translatedLearningobject}</p>
                        <p>#</p>
                        <p>{translatedStatus}</p>
                    </div>
                
                    <div class="submission-scroll">
                        {#each submissions as submission}
                            <div class="submission-row">
                                <p>{submission.grade * 100}%</p>
                                <p>{submission.time}</p>
                                <p>{submission.learningobject}</p>
                                <p>{submission.amount}</p>
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



<p>{assignmentId}</p>
<p>{groupId}</p>
<p>{classId}</p>
<p>{JSON.stringify(assignment)}</p>
<p>{JSON.stringify(classroom)}</p>
<p>{JSON.stringify(group)}</p>

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