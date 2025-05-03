<script lang="ts">
    import Header from "../../../../lib/components/layout/Header.svelte";
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
    $: translatedGroups = $currentTranslations.groupsPage.groups;
    $: translatedNumber = $currentTranslations.groupsPage.number;

    let assignmentId = urlWithoutParams.split("/")[4];
    let classId = urlWithoutParams.split("/")[2];
    let groupsUrls: string[] = [];
    let groupsIds: string[] = [];
    let assignmentName = "";
    let className = "";
    let done = 2;

    let groups: any[] = []; // Array to hold group data including student names

    async function fetchClass() {
        try {
            const response = await apiRequest(`/classes/${classId}`, "GET");
            className = response.name;
        } catch(error){
            console.error("Error fetching class: " + error);
        }
    }

    async function fetchAssignment() {
        try {
            const response = await apiRequest(`/classes/${classId}/assignments/${assignmentId}`, "GET");
            assignmentName = response.name;
        } catch(error){
            console.error("Error fetching assignment: " + error);
        }
    }

    async function fetchGroups() {
        try {
            const response = await apiRequest(`/classes/${classId}/assignments/${assignmentId}/groups`, "GET");
            groupsUrls = response.groups;
        } catch(error) {
            console.error("Error fetching groups: " + error);
        }
    }

    async function fetchGroup() {
        try {
            for(let groupUrl of groupsUrls) {
                const groupId = groupUrl.split("/").pop();
                if (groupId !== undefined) {
                    groupsIds = groupsIds.concat(groupId);
                }
                const response = await apiRequest(`${groupUrl}`, "GET");
                const studentsResponse = await apiRequest(response.links.students, "GET");
                const students = studentsResponse.students.map(async (studentUrl: string) => {
                    const student = await apiRequest(studentUrl, "GET");
                    return student.name;
                });
                const groupData = {
                    groupName: response.name,
                    students: await Promise.all(students)
                };
                groups = [...groups, groupData];
            }
        } catch(error) {
            console.error("Error fetching one group: " + error);
        }
    }

    async function goTo(url:string) {
        const newUrl = '/classrooms' + url.slice(8);
        routeTo(`${newUrl}/dashboard`);
    }

    onMount(async () => {
        await fetchGroups();
        await fetchGroup();
        await fetchAssignment();
        await fetchClass();
    });

</script>

<main>
    <Header/>
    <BackButton text={$currentTranslations.assignments.assignments}/>
    <h1>{translatedClass}: <span style="color:#80cc5d">{className}</span> </h1>
    <h2>{translatedAssignment}: <span style="color:#80cc5d">{assignmentName}</span></h2>
    <h3>{translatedGroups}: </h3>
    <div class="card-container">
        {#each groups as group, index}
            <button class="card" on:click={ async () => { goTo(groupsUrls[index])}}> 
                <p class="card-index">{translatedNumber}: {index + 1}</p>
                <p>{group.groupName}</p>
                <p style="font-weight: bold">Students:</p>
                <ul>
                    {#each group.students as student}
                        <li>{student}</li>
                    {/each}
                </ul>
                <p style="font-weight: bold">Progress:</p>
                <progress value={(Number.isFinite(done) && Number.isFinite(5) && 5 > 0) 
                    ? done / 5 * 100 
                    : 0} 
                    max="100">
                </progress>
            </button>
        {/each}
    </div>
</main>

<style>
    .card {
        background-color: white;
        border-radius: 12px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        margin-top: 1rem;
        padding: 1rem;
        margin-bottom: 1rem;
        transition: transform 0.2s ease;
        width: 200px;
        background: transparent;
        cursor: pointer;
        padding: 0.5rem 1rem;
        font-size: 1rem;
        text-decoration: none;
        transition: all 0.2s ease;
        cursor: pointer;
        min-width: 150px;
    }

    .card-container {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        border: 15px solid var(--dwengo-green);
        border-radius: 15px;
        justify-content: center;
        gap: 10px;
        padding: 1rem;
        min-width: 250px;
    }

    .card:hover {
        transform: translateY(-2px);
    }

    .card-index {
        font-weight: bold;
        color: #555;
        margin-bottom: 0.5rem;
    }

    .card:hover {
        background-color: var(--dwengo-green);
    }

    ul {
        padding-left: 0;
        margin-top: 0.5rem;
    }

    li {
        list-style-type: none;
        margin-left: 0;
        padding: 0;
    }

    progress {
        appearance: none;
        -webkit-appearance: none;
        height: 20px;
        width: 100%;
        border-radius: 10px;
        overflow: hidden;
        background-color: #eee;
        border: none;
    }
</style>
