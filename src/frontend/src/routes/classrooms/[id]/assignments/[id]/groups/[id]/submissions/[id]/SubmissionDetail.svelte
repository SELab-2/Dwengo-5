<script lang="ts">
    import Header from "../../../../../../../../../lib/components/layout/Header.svelte";
    import Footer from "../../../../../../../../../lib/components/layout/Footer.svelte";
    import BackButton from "../../../../../../../../../lib/components/ui/BackButton.svelte";

    import { onMount } from "svelte";
    import { apiRequest } from "../../../../../../../../../lib/api";
    import { routeTo } from "../../../../../../../../../lib/route.ts";
    import { formatDate } from "../../../../../../../../../lib/utils.ts";
    import { currentTranslations } from "../../../../../../../../../lib/locales/i18n";

    $: translatedClassroom = $currentTranslations.submissionDetail.classroom;
    $: translatedGroup = $currentTranslations.submissionDetail.group;
    $: translatedSubmission = $currentTranslations.submissionDetail.submission;
    $: translatedFor = $currentTranslations.submissionDetail.for;
    $: translatedGrade = $currentTranslations.submissionDetail.grade;
    $: translatedUpdate = $currentTranslations.submissionDetail.update;
    $: translatedContent = $currentTranslations.submissionDetail.content;

    function getQueryParamsURL() {
        const urlParams = new URLSearchParams(window.location.search);
        let role = urlParams.get("role") || "";
        let id = urlParams.get("id") || "";

        return {
            role: role,
            id: id,
        };
    }

    let loading = true;
    let role = getQueryParamsURL().role;
    let id = getQueryParamsURL().id;

    let url = window.location.pathname;
    console.log(url);
    let assignmentId = url.split("/")[4];
    let groupId = url.split("/")[6];
    let classId = url.split("/")[2];
    let submissionId = url.split("/")[8];
    let assignment = null;
    let assignmentName = "";
    let deadline = "";
    let group = null;
    let classroom = null;
    let classroomName = "";
    let submissionContent = "";
    let grade: number = 0;
    let patchGradeContent = "";

    async function fetchAssignment() {
        try {
            const response = await apiRequest(
                `/classes/${classId}/assignments/${assignmentId}`,
                "GET"
            );
            assignment = response;
            assignmentName = assignment.name;
            deadline = formatDate(assignment.deadline);
        } catch (error) {
            console.error("Error fetching assignment");
            console.log(error);
        }
    }

    async function fetchGroup() {
        try {
            const response = await apiRequest(
                `/classes/${classId}/assignments/${assignmentId}/groups/${groupId}`,
                "GET"
            );
            group = response;
        } catch (error) {
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

    async function fetchSubmission() {
        try {
            const response = await apiRequest(
                `/users/${id}/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/submissions/${submissionId}`,
                "GET"
            );
            grade = response.submissions[0].grade;
            submissionContent = response.submissions[0].submission_content;
        } catch (error) {
            console.error("Error fetching submissions: " + error);
        }
    }

    async function patchGrade() {
        try {
            const response = await apiRequest(
                `/users/${id}/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/submissions/${submissionId}`,
                "PATCH",
                {
                    body: JSON.stringify({
                        grade: grade,
                        teacher: `/users/${id}`,
                    }),
                }
            );
        } catch (error) {
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

<div>
    <Header></Header>
    <div class="title-container">
        <h1 class="title">
            {translatedSubmission}
            {translatedFor}: <span style="color:#80cc5d">{assignmentName}</span>
        </h1>
        <h2>
            {$currentTranslations.assignment.deadline}:
            <span style="color:#80cc5d">{deadline}</span>
        </h2>
        <h2>
            {translatedClassroom}:
            <span style="color:#80cc5d">{classroomName}</span>
        </h2>
        <h2>{translatedGroup}: <span style="color:#80cc5d">{groupId}</span></h2>
        <h2>{translatedGrade}: <span style="color:#80cc5d">{grade}</span></h2>
    </div>
    <h2 class="submission-title">{translatedSubmission} {translatedContent}</h2>
    <div class="submission-card">
        <p>{submissionContent}</p>
    </div>

    {#if role === "teacher"}
        <h2 class="submission-title">{translatedUpdate} {translatedGrade}</h2>
        <div class="grade-card">
            <textarea
                class="mytextarea"
                bind:value={grade}
                placeholder="Place the new grade here (must be a number)"
                rows="1"
            ></textarea>
            <button on:click={patchGrade}>Submit</button>
        </div>
    {/if}

    <Footer></Footer>
</div>

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
        border-radius: 16px;
        box-shadow: 0 4px 12px rgba(0, 128, 0, 0.15); /* soft green shadow */
        font-family: sans-serif;
        background-color: white;
        border: 15px solid var(--dwengo-green);
        padding: 20px;
        overflow-y: auto;
        width: 250px;
        min-height: 100px;
        position: relative;

        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .mytextarea {
        width: 100%;
        height: 30px;
    }

    .grade-card button {
        display: block;
        width: 50%;
        height: 25px;
        background-color: var(--dwengo-green);
        color: white;
        border: none;
    }

    .submission-title {
        padding-top: 5%;
        font-size: 2rem;
        margin-bottom: 20px;
    }
</style>
