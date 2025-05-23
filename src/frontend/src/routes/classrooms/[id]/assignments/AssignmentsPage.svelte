<script lang="ts">
    import Header from "../../../../lib/components/layout/Header.svelte";
    import Footer from "../../../../lib/components/layout/Footer.svelte";
    import Drawer from "../../../../lib/components/features/Drawer.svelte";
    import BackButton from "../../../../lib/components/ui/BackButton.svelte";
    import { currentTranslations } from "../../../../lib/locales/i18n";
    import { onMount } from "svelte";
    import { apiRequest } from "../../../../lib/api";
    import { routeTo } from "../../../../lib/route.ts";

    const navigation_items = ["dashboard", "assignments"];

    $: translatedTitle = $currentTranslations.assignmentClassPage.title;
    $: translatedDeadline = $currentTranslations.assignmentClassPage.deadline;
    $: translatedFurther = $currentTranslations.assignmentClassPage.further;
    $: translatedGroups = $currentTranslations.assignmentClassPage.message;

    let classId = "";
    let classroomName = "";
    let groupsIds: number[] = [];
    let id: string = "";

    let assignmentUrls: string[] = [];
    let groupId = "";

    async function fetchStudentsClassAssignments() {
        try {
            const response = await apiRequest(
                `/users/${id}/classes/${classId}/assignments`,
                "GET"
            );
            assignmentUrls = response.assignments;
        } catch (error) {
            console.error("Error while fetching student class assignments");
        }
    }

    async function fetchTeacherClassAssignments() {
        try {
            const response = await apiRequest(
                `/classes/${classId}/assignments`,
                "GET"
            );
            assignmentUrls = response.assignments;
        } catch (error) {
            console.error("Error while fetching teacher class assignments");
        }
    }

    let assignments: assignment[] = [];

    type assignment = {
        deadline: string;
        name: string;
        learningpath: string;
        learningpathDescription?: string;
        url: string;
        image: any;
    };

    async function fetchAssignments() {
        try {
            for (let assignment of assignmentUrls) {
                const response = await apiRequest(`${assignment}`, "GET");
                const learningPathResponse = await apiRequest(
                    `${response.learningpath}`,
                    "GET"
                );

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

    async function fetchClass() {
        try {
            const response = await apiRequest(`/classes/${classId}`, "GET");
            classroomName = response.name;
        } catch (error) {
            console.error("Error fetching class");
        }
    }
    let role: string = "";
    let urlWithoutParams = "";

    onMount(async () => {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            role = urlParams.get("role") || "";
            id = urlParams.get("id") || "";

            urlWithoutParams = window.location.pathname;
            let urlSplit = urlWithoutParams.split("/");
            classId = urlSplit[2];

            await fetchClass();
            if (role === "student") {
                await fetchStudentsClassAssignments();
            } else {
                await fetchTeacherClassAssignments();
            }
            await fetchAssignments();
        } catch (e) {
            console.error("Error in onMount:", e);
        }
    });

    function formatDate(dateString: string): string {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${day}-${month}-${year} ${hours}:${minutes}`;
    }

    async function goTo(url: string) {
        const assignmentId = url.split("/").pop();
        const response = await apiRequest(`${url}`, "GET");
        const learnpath = await apiRequest(`${response.learningpath}`, "GET");
        const content = await apiRequest(`${learnpath.links.content}`, "GET");

        routeTo(
            `classrooms/${classId}/assignments/${assignmentId}${content.learningPath[0].learningObject}`
        );
    }

    async function goToGroups(url: string) {
        const assignmentId = url.split("/").pop();
        const classIdc = url.split("/")[2];
        routeTo(`classrooms/${classIdc}/assignments/${assignmentId}/groups`);
    }

    async function fetchGroup(assignmentId: string) {
        try {
            const response = await apiRequest(
                `/users/${id}/classes/${classId}/assignments/${assignmentId}/groups`,
                "GET"
            );
            groupId = response.group.split("/").pop();
        } catch (error) {
            console.error("Error fetching group " + error);
        }
    }

    async function goToSubmissions(url: string) {
        const assignmentId = url.split("/").pop();
        const classIdc = url.split("/")[2];
        await fetchGroup(assignmentId);
        routeTo(
            `classrooms/${classIdc}/assignments/${assignmentId}/groups/${groupId}/submissions`
        );
    }
    
</script>

<main>
    <div>
        <Header />
        <div class="body">
            <BackButton text={$currentTranslations.assignments.classgroup} />
            <div class="title-container">
                <h1>
                    {translatedTitle}
                    <span style="color:#80cc5d">{classroomName}</span>
                </h1>
            </div>
            <div class="content">
                <!-- Drawer Navigation -->
                <Drawer
                    {navigation_items}
                    navigation_paths={[
                        `classrooms/${classId}`,
                        `classrooms/${classId}/assignments`,
                    ]}
                    active="assignments"
                />

                <div class="assignments-content">
                    {#if role === "teacher"}
                        <button
                            class="button create-assignment"
                            on:click={() =>
                                routeTo(`${urlWithoutParams}/create`)}
                            >{$currentTranslations.assignments.create}</button
                        >
                    {/if}

                    <!-- Assignment Cards Container -->
                    <div class="assignments-container">
                        {#if assignments.length === 0}
                            <p class="no-assignments">
                                {$currentTranslations.assignments.noAssignments}
                            </p>
                        {/if}
                        {#each assignments as assignment}
                            <div class="assignment-card">
                                <div class="image-container">
                                    {#if assignment.image === null}
                                        <img
                                            class="image"
                                            src="/images/learning_path_img_test2.jpeg"
                                            alt="learning-path"
                                        />
                                    {:else}
                                        <img
                                            class="image"
                                            src="data:image/png;base64, {assignment.image}"
                                            alt="learning-path"
                                        />
                                    {/if}
                                </div>
                                <div class="card-content">
                                    <div class="assignment-title">
                                        <h3>{assignment.name}</h3>
                                    </div>
                                    <p>
                                        <strong>{translatedDeadline}:</strong>
                                        {formatDate(assignment.deadline)}
                                    </p>
                                    <button
                                        class="link-button"
                                        on:click|preventDefault={() =>
                                            goTo(assignment.url)}
                                        >→ Learningpath</button
                                    >
                                    {#if role === "teacher"}
                                        <button
                                            class="link-button"
                                            on:click|preventDefault={() =>
                                                goToGroups(assignment.url)}
                                            >→ {translatedGroups}</button
                                        >
                                    {/if}
                                    {#if role === "student"}
                                        <button
                                            class="link-button"
                                            on:click|preventDefault={() =>
                                                goToSubmissions(assignment.url)}
                                            >→ submissions</button
                                        >
                                    {/if}
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Footer />
</main>

<style>
    .content {
        display: flex; /* Enables flexbox */
        gap: 20px; /* Adds spacing between elements */
        align-items: flex-start; /* Aligns items at the top */
    }

    .assignments-container {
        display: flex;
        flex-wrap: wrap;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px 20px;
        justify-content: center; /* Centers cards in the container */
        background-color: white;
        border: 15px solid var(--dwengo-green);
        border-radius: 15px;
        margin-left: 20px;
        padding: 20px;
        margin: 0px auto; /* Centers the container */
        overflow-y: auto; /* Enables vertical scrolling if needed */
        min-height: 700px; /* Ensures consistent size */
        max-height: 80vh;
    }

    .assignment-card {
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        width: auto;
        max-width: 250px;
        height: fit-content;
    }

    .card-content {
        padding: 15px;
        justify-content: left;
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

    .assignment-card {
        text-decoration: none;
        color: inherit;
        display: block;
        cursor: pointer;
    }

    .assignment-card:hover {
        background-color: #f9f9f9;
    }

    .assignments-content {
        display: flex;
        flex-direction: column;
        margin: 0px auto; /* Centers the container */
    }

    .image-container {
        width: 100%;
        display: flex;
        justify-content: center;
        margin-bottom: 10px;
    }

    .image {
        max-width: 250px;
        max-height: 250px;
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

    .link-button {
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 0.5rem 1rem;
        font-size: 1rem;
        text-decoration: none;
        transition: all 0.2s ease;
        cursor: pointer;
    }

    .link-button:hover {
        color: #0056b3;
        text-decoration: underline;
        background-color: rgba(0, 123, 255, 0.1); /* subtle hover background */
    }

    .link-button:hover {
        text-decoration: underline; /* Optional hover effect */
    }

    @media (max-width: 1000px) {
        .assignments-container {
            grid-template-columns: 1fr; /* Stack in one column */
        }
    }
</style>
