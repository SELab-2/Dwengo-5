<script lang="ts">
    import Header from "../../../../../../../lib/components/layout/Header.svelte";
    import Footer from "../../../../../../../lib/components/layout/Footer.svelte";
    import { currentTranslations } from "../../../../../../../lib/locales/i18n";
    import { onMount } from "svelte";
    import { apiRequest } from "../../../../../../../lib/api";
    import { routeTo } from "../../../../../../../lib/route.ts";
    import { formatDate } from "../../../../../../../lib/utils.ts";
    import type {
        MetaData,
        LearningObject,
    } from "../../../../../../../lib/types/types.ts";

    function getQueryParamsURL() {
        const queryParams = new URLSearchParams(window.location.search); // Extract the query parameters after '?'

        return {
            role: queryParams.get("role"),
            id: queryParams.get("id"),
        };
    }

    let loading = true;
    let role = getQueryParamsURL().role;
    let id = getQueryParamsURL().id;

    let urlWithoutParams = window.location.pathname;
    let assignmentId = urlWithoutParams.split("/")[4];
    let classId = urlWithoutParams.split("/")[2];
    let learningobjectId = urlWithoutParams.split("/")[6];

    let learnpathUrl = "";
    let learnpathId = "";

    let leerpadlinks: string[] = [];
    let learnpathName = "";
    let learningobjectLinks: string[] = [];
    let total = 0;

    let metaData: MetaData[] = [];
    let currentLearningObject = 0;
    let time = "";
    let name = "";
    let contentUrl = "";
    let content: string = "";
    let progress = 0;
    let learningobject: LearningObject | null = null;

    let assignment = null;
    let assignmentName = "";
    let deadline = "";

    let showDropdown = false;
    let title = "";
    let message = "";
    let errorPost = "";

    let submissionDropdown = false;
    let submissionTitle = "";
    let submissionMessage = "";
    let submissionType = "";
    let correctAnswers: string[] = [];
    let possibleAnswers: string[] = [];
    let userSelection: string[] = [];
    let score = 0;
    let lastScore = 0;
    let groupId = null;


    async function fetchGroup() {
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

    async function fetchAssignment() {
        try {
            const response = await apiRequest(
                `/classes/${classId}/assignments/${assignmentId}`,
                "GET"
            );
            assignment = response;
            learnpathUrl = response.learningpath;
            learnpathId = learnpathUrl.split("/")[2];
            assignmentName = assignment.name;
            deadline = formatDate(assignment.deadline);
        } catch (error) {
            console.error("Error fetching assignment");
        }
    }

    async function getLearnpath() {
        try {
            const response = await apiRequest(
                `/learningpaths/${learnpathId}`,
                "GET"
            );
            leerpadlinks = response.links.content;
            learnpathName = response.name;
        } catch (error) {
            console.error("Error fetching Learnpath");
        }
    }

    async function getContentLearnpath() {
        try {
            const response = await apiRequest(`${leerpadlinks}`, "GET");
            for (let i = 0; i < response.learningPath.length; i++) {
                learningobjectLinks = learningobjectLinks.concat(
                    response.learningPath[i].learningObject
                );
                if (id === learningobjectLinks[i].split("/").pop()) {
                    progress = i + 1;
                }
            }
            total = learningobjectLinks.length;
        } catch (error) {
            console.error("Error fetching content.");
        }
    }

    async function getMetadata() {
        try {
            for (let url of learningobjectLinks) {
                const response = await apiRequest(`${url}`, "GET");
                const htmlContent = await apiRequest(
                    `${response.links.content}`,
                    "GET"
                );
                const q: LearningObject = {
                    title: response.name,
                    time: response.estimated_time,
                    language: response.language,
                    difficulty: response.difficulty,
                    links: {
                        content: htmlContent,
                    },
                };
                metaData = metaData.concat(q);
            }
            loading = false;
        } catch (error) {
            console.error("Error fetching metadata");
        }
    }

    function toggleAnswer(answer: any) {
        if (userSelection.includes(answer)) {
            userSelection = userSelection.filter((a) => a !== answer);
        } else {
            userSelection = [...userSelection, answer];
        }
    }

    async function autoSubmit() {
        const correctSet = new Set(correctAnswers);
        const userSet = new Set(userSelection);
        const correctSelections = userSelection.filter((a) =>
            correctSet.has(a)
        ).length;
        const incorrectSelections = userSelection.filter(
            (a) => !correctSet.has(a)
        ).length;
        score =
            (100 * (correctSelections - incorrectSelections)) /
            correctSelections;
        submissionMessage = "";
        for (let input of userSelection) {
            submissionMessage = submissionMessage.concat(input + " \n");
        }
        postAutoSubmission();
        userSelection = [];
    }

    async function getlearningObject() {
        try {
            const response = await apiRequest(
                `/learningobjects/${learningobjectId}`,
                "GET"
            );
            possibleAnswers = response.possibleAnswers;
            correctAnswers = response.answer;
            submissionType = response.submissionType;
            learningobject = response;
            name = response.name;
            time = response.estimated_time;
            if (learningobject) contentUrl = learningobject.links.content;
        } catch (error) {
            console.error("Error fetching learningobject");
        }
    }

    function setCurrentLearningObject(index: number) {
        currentLearningObject = index;
    }

    function getUrls() {
        const url = window.location.href;
        learningobjectId = url.split("/").pop()?.split("?")[0] || "";
    }

    $: {
        learningobjectId =
            window.location.href.split("/").pop()?.split("?")[0] || "";

        if (learningobjectId) {
            (async () => {
                await getlearningObject();
                await getContent();
                for (let i = 0; i < learningobjectLinks.length; i++) {
                    if (
                        learningobjectId ===
                        learningobjectLinks[i].split("/").pop()
                    ) {
                        progress = i + 1;
                    }
                }
            })();
        }
    }

    async function getContent() {
        try {
            if (!contentUrl) return;
            const response = await apiRequest(`${contentUrl}`, "GET");
            content = response.htmlContent;
        } catch (error) {
            console.error("Error fetching content of learningobject");
        }
    }

    async function further() {
        learningobjectLinks = [];
        getUrls();
        await fetchAssignment();
        await getLearnpath();
        await getContentLearnpath();
        await getMetadata();
        await fetchGroup();

        if (learningobjectId) {
            (async () => {
                await getlearningObject();
                await getContent();
                for (let i = 0; i < learningobjectLinks.length; i++) {
                    if (
                        learningobjectId ===
                        learningobjectLinks[i].split("/").pop()
                    ) {
                        progress = i + 1;
                    }
                }
            })();
        }
    }

    onMount(async () => {
        getUrls();
        await fetchAssignment();
        await getLearnpath();
        await getContentLearnpath();
        await getMetadata();
        await fetchGroup();
    });

    async function postAutoSubmission() {
        if (submissionMessage.trim()) {
            try {
                const response = await apiRequest(
                    `/users/${id}/classes/${classId}/assignments/${assignmentId}/submissions/auto/`,
                    "POST",
                    {
                        body: JSON.stringify({
                            learningObject: `/learningobjects/${learningobjectId}`,
                            submissionType: submissionType,
                            submission: submissionMessage.trim(),
                            grade: score,
                        }),
                    }
                );

                submissionMessage = "";
            } catch (error) {
                console.error("Failed to post message:", error);
            }
        }
    }

    async function postSubmission() {
        if (submissionMessage.trim()) {
            try {
                const response = await apiRequest(
                    `/users/${id}/classes/${classId}/assignments/${assignmentId}/submissions/`,
                    "POST",
                    {
                        body: JSON.stringify({
                            learningObject: `/learningobjects/${learningobjectId}`,
                            submissionType: submissionType,
                            submission: submissionMessage.trim(),
                        }),
                    }
                );

                submissionMessage = "";
            } catch (error) {
                console.error("Failed to post message:", error);
            }
        }
    }

    async function postMessage() {
        if (message.trim() && title.trim()) {
            try {
                //Create conversation
                const resp = await apiRequest(
                    `/users/${id}/classes/${classId}/assignments/${assignmentId}/groups`,
                    "GET"
                );
                const groupId = resp.group.split("/").pop();
                console.log(learningobjectId);
                const response = await apiRequest(
                    `/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/conversations/`,
                    "POST",
                    {
                        body: JSON.stringify({
                            title: title.trim(),
                            learningobject: `/learningobjects/${learningobjectId}`,
                        }),
                    }
                );

                //Add initial message to conversation
                await apiRequest(`${response.conversation}/messages`, "POST", {
                    body: JSON.stringify({
                        sender: `/users/${id}`,
                        content: message.trim(),
                    }),
                });

                title = "";
                message = "";
                showDropdown = false;
            } catch (err) {
                console.error("Failed to post message:", err);
                errorPost = "Failed to post message.";
            }
        }
    }
</script>

<main>
    <Header />
    {#if loading}
        <p>{$currentTranslations.assignment.loading}...</p>
    {:else}
        <div class="scrollable-section">
            <div class="title-container">
                <h1 class="title">
                    {$currentTranslations.assignment.title}:
                    <span style="color:#80cc5d">{assignmentName}</span>
                </h1>
                <h2>
                    {$currentTranslations.assignment.deadline}:
                    <span style="color:#80cc5d">{deadline}</span>
                </h2>
            </div>
            <div class="container">
                <div class="side-panel">
                    {#each learningobjectLinks as link, index}
                        <a
                            href={`/classrooms/${classId}/assignments/${assignmentId}${link}`}
                            on:click|preventDefault={() => {
                                setCurrentLearningObject(index);
                                further();
                                routeTo(
                                    `/classrooms/${classId}/assignments/${assignmentId}${link}`
                                );
                            }}
                            class="side-panel-element {index ===
                            currentLearningObject
                                ? 'current'
                                : ''}"
                        >
                            <span>{metaData[index].time}'</span>
                            <span>{metaData[index].title}</span>
                        </a>
                    {/each}
                </div>

                <div class="content">
                    <div class="progress">
                        <p>{$currentTranslations.assignments.progress}</p>
                        <div class="progress-wrapper">
                            <span>0</span>
                            <div class="progress-container">
                                <div
                                    class="progress-bar"
                                    style="width: {((progress - 1) / total) *
                                        100}%"
                                ></div>
                            </div>
                            <span
                                >{Math.round(
                                    ((progress - 1) / total) * 100
                                )}%</span
                            >
                        </div>
                    </div>

                    <h2 class="learningobject-title">{name}</h2>

                    <div class="learningpath-card">
                        <div class="card-content">
                            {@html content}
                        </div>
                    </div>
                    {#if role === "student"}
                        {#if submissionType === "multiplechoice" || submissionType === "plaintext"}
                            <div class="submission-container">
                                {#if role === "student"}
                                    <h2 class="learningobject-title">
                                        {$currentTranslations.assignments.make}
                                    </h2>
                                    <div class="submission-content">
                                        {#if submissionType === "multiplechoice"}
                                            <h2>{$currentTranslations.assignments.select}:</h2>

                                            <ul>
                                                {#each possibleAnswers as answer}
                                                    <li>
                                                        <button
                                                            on:click={() =>
                                                                toggleAnswer(
                                                                    answer
                                                                )}
                                                        >
                                                            {answer}
                                                        </button>
                                                    </li>
                                                {/each}
                                            </ul>

                                            <p>
                                                {$currentTranslations.assignments.selected}: {userSelection.join(
                                                    ", "
                                                )}
                                            </p>

                                            <button on:click={autoSubmit}>
                                                {$currentTranslations.assignments.submit}
                                            </button>
                                        {:else if submissionType === "plaintext"}
                                            <textarea
                                                bind:value={submissionMessage}
                                                placeholder="Type your Submission here..."
                                                rows="25"
                                            ></textarea>
                                            <button on:click={postSubmission}
                                                >{$currentTranslations.assignments.send}</button
                                            >
                                        {/if}
                                    </div>
                                {/if}
                            </div>
                        {/if}
                    {/if}
                </div>
            </div>
        </div>
        {#if role === "student"}
            <div class="ask-question-wrapper">
                <button class="ask-question-button" on:click={() => (showDropdown = !showDropdown)}>
                    {$currentTranslations.assignments.askQuestion || 'Ask a question'}
                </button>

                {#if showDropdown}
                    <div class="ask-question-dropdown">
                        <input
                            type="text"
                            bind:value={title}
                            placeholder={$currentTranslations.assignments.title}
                            class="dropdown-input"
                        />
                        <textarea
                            type="text"
                            bind:value={message}
                            placeholder={$currentTranslations.assignments.message}
                            class="dropdown-input"
                        />
                        <button class="submit-button" on:click={postMessage}>{$currentTranslations.assignments.submit}</button>
                    </div>
                {/if}
            </div>
        {/if}
    {/if}
    <Footer />
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }

    .scrollable-section {
        overflow-y: auto;
        border: 1px solid #ccc;
        padding: 1rem;
    }

    .learningpath-card {
        flex: 1;
        border-radius: 16px;
        box-shadow: 0 4px 12px rgba(0, 128, 0, 0.15); /* soft green shadow */
        font-family: sans-serif;
        border-radius: 15px;
        background-color: white;
        border: 15px solid var(--dwengo-green);
        padding: 20px;
        overflow-y: auto;
    }

    .submission-content {
        flex: 1;
        border-radius: 16px;
        box-shadow: 0 4px 12px rgba(0, 128, 0, 0.15); /* soft green shadow */
        font-family: sans-serif;
        border-radius: 15px;
        background-color: white;
        border: 15px solid var(--dwengo-green);
        padding: 20px;
        overflow-y: auto;
        min-height: 300px;
        width: 97%; /* You can adjust the min-height as needed for a bigger card */
    }

    .content {
        display: flex;
        flex-direction: column;
        width: 100%;
        margin: 0px 80px;
        padding: 20px;
        flex: 1;
        min-height: 0;
    }

    .container {
        display: flex;
        flex: 1;
        gap: 5px;
        padding: 5px;
        height: 100%;
        min-height: 0;
    }

    .side-panel {
        display: flex;
        flex-direction: column;
        width: 310px;
        font-family: sans-serif;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        border: none;
        margin: 20px;
        margin-top: 50px;
        flex-shrink: 0;
        align-self: flex-start; /* Prevent it from stretching vertically */
    }

    button.selected {
        background-color: lightgreen;
    }

    .side-panel-element {
        display: block;
        justify-content: space-between;
        align-items: center;
        padding: 15px 20px;
        font-size: 14px;
        color: #333;
        border: 1px solid gainsboro;
        margin-bottom: -1px; /* Prevent double border where cards meet */
        color: inherit;
        text-decoration: none;
        cursor: pointer;
    }

    .side-panel-element.current {
        background-color: var(
            --dwengo-green
        ); /* more solid green for headers */
        font-weight: bold;
    }

    .card-content p {
        font-size: 1rem;
        color: #333;
        margin-bottom: 10px;
    }

    .progress-wrapper {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        margin-bottom: 20px; /* less space below */
    }

    .progress-container {
        flex: 1;
        height: 10px; /* smaller height */
        background-color: #e0e0e0; /* light grey like in the image */
        border-radius: 4px;
        overflow: hidden;
    }

    .progress-bar {
        height: 100%;
        background-color: #80cc5d; /* matches Dwengo green */
        transition: width 0.3s ease;
    }

    .progress {
        width: 60%;
    }

    .learningobject-title {
        font-size: 2rem;
        margin-bottom: 20px;
    }

    .title-container {
        flex: 0;
        padding-left: 20px;
    }

    .title {
        font-family: "C059-Roman";
        font-size: 3rem;
        justify-content: top; /* Center vertically */
        margin-bottom: 5px;
    }

    .question-container {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 20px;
        position: relative;
    }

    button {
        background-color: var(--dwengo-green);
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 5px;
        cursor: pointer;
    }

    .dropdown {
        position: absolute;
        top: 110%;
        right: 0;
        background: white;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
        width: 300px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .submission-container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding-top: 5%;
        margin-bottom: 20px;
    }

    .dropdown-submission {
        top: 110%;
        right: 0;
        background: white;
        padding: 5px;
        border: 1px solid #ccc;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
        width: 300px;
        display: flex; /* Add this */
        flex-direction: column; /* Add this */
        gap: 10px;
    }

    textarea {
        resize: vertical;
        width: 94%;
        padding: 8px;
        border-radius: 4px;
        border: 1px solid #ccc;
    }

    :global(.card-content img) {
		max-width: 500px !important;
		height: auto !important;
	}
    .ask-question-wrapper {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }

    .ask-question-button {
        background-color: #4CAF50; /* Green tone */
        color: white;
        padding: 10px 16px;
        border: none;
        border-radius: 999px;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        transition: background-color 0.2s;
    }

    .ask-question-button:hover {
        background-color: #43a047;
    }

    .ask-question-dropdown {
        margin-top: 10px;
        background-color: white;
        border: 1px solid #ccc;
        border-radius: 12px;
        padding: 12px;
        width: 280px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        gap: 8px;
        box-sizing: border-box;
    }

    .dropdown-input {
        width: 100%;
        padding: 8px 10px;
        font-size: 14px;
        border: 1px solid #ddd;
        border-radius: 6px;
        outline: none;
        background-color: #f9f9f9;
        box-sizing: border-box;
    }

    .dropdown-input:focus {
        border-color: #4CAF50;
        background-color: white;
    }

    .submit-button {
        align-self: flex-end;
        padding: 8px 14px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 6px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .submit-button:hover {
        background-color: #43a047;
    }

</style>
