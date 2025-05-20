<script lang="ts">
    import Header from "../../../../../lib/components/layout/Header.svelte";
    import Footer from "../../../../../lib/components/layout/Footer.svelte";
    import Drawer from "../../../../../lib/components/features/Drawer.svelte";
    import LearningPathsColumn from "./LearningPathsColumn.svelte";
    import StudentsGroupsColumn from "./StudentsGroupsColumn.svelte";
    import {
        chosenLearningPath,
        groups,
    } from "../../../../../lib/stores/createAssignment.ts";
    import { currentTranslations } from "../../../../../lib/locales/i18n";
    import "../../../../../lib/styles/global.css";
    import { apiRequest } from "../../../../../lib/api";
    import { user } from "../../../../../lib/stores/user.ts";
    import { get } from "svelte/store";
    import { onMount } from "svelte";
    import { routeTo } from "../../../../../lib/route.ts";

    let name: string;
    let deadline: Date;
    let className: string | null = null;

    let nameError = false;
    let deadlineError = false;
    let learningPathError = false;
    let groupError = false;

    onMount(() => {
        // Clear stores to reset the page state
        groups.set([{ id: 0, name: "1", students: [] }]);
        chosenLearningPath.set(null);
    });

    async function createAssignment() {
        // Reset error states
        nameError = false;
        deadlineError = false;
        learningPathError = false;
        groupError = false;

        // Check if all fields are filled in
        if (!get(chosenLearningPath)) learningPathError = true;
        if (!name) nameError = true;
        if (!deadline) deadlineError = true;

        if (nameError || deadlineError || learningPathError) return;

        // Remove empty groups
        const filteredGroups = get(groups).filter(
            (group) => group.students && group.students.length > 0
        );

        if (filteredGroups.length === 0) {
            groupError = true;
            return;
        }

        groups.set(filteredGroups);

        // Create assignment
        let response = await apiRequest(
            `/classes/${classId}/assignments`,
            "POST",
            {
                body: JSON.stringify({
                    name: name,
                    learningpath: get(chosenLearningPath)!.url,
                    deadline: deadline,
                }),
            }
        );
        const assignmentUrl = response.assignment;

        // Create all the groups for the assignment
        for (const group of get(groups)) {
            const studentUrls = group.students.map((student) => {
                const match = student.url.match(/students\/\d+/);
                return match ? match[0].replace("students", "/users") : null;
            });

            await apiRequest(`${assignmentUrl}/groups`, "POST", {
                body: JSON.stringify({
                    groupName: group.name,
                    students: studentUrls,
                }),
            });
        }

        routeTo(`/classrooms/${classId}/assignments`);
    }

    $: classId = window.location.pathname.split("/")[2];

    // Watch for changes in name and deadline to reset error states
    $: if (nameError && name) nameError = false;
    $: if (deadlineError && deadline) deadlineError = false;

    $: {
        const nonEmptyGroups = $groups.filter((g) => g.students?.length > 0);
        if (groupError && nonEmptyGroups.length > 0) {
            groupError = false;
        }
    }

    // Fetch class name when classId changes
    $: if (classId) {
        (async () => {
            try {
                const response = await apiRequest(`/classes/${classId}`, "GET");
                className = response.name || null;
            } catch (error) {
                console.error("Failed to fetch class name:", error);
                className = null;
            }
        })();
    }
</script>

<main>
    {#if user}
        <Header />
        <div class="container">
            <div class="title-container">
                <p class="title">
                    {$currentTranslations.assignments.classroom}:
                    <span class="title" style="color:#80cc5d"
                        >{className || classId}</span
                    >
                </p>
            </div>

            <div class="bottom">
                <div class="drawer-container">
                    <!--<Drawer navigation_items={["members", "assignments"]} navigation_paths={["members", "assignments"]} active="assignments" />-->
                </div>

                <div class="assignment-content">
                    <div class="button-container">
                        <div class="error-container">
                            {#if learningPathError}
                                <p class="error">
                                    {$currentTranslations.assignments
                                        .learningPathError}
                                </p>
                            {/if}
                        </div>
                        <div class="inputs-container">
                            <label for="deadline"
                                >{$currentTranslations.assignments
                                    .deadline}:</label
                            >
                            <input
                                id="deadline"
                                type="date"
                                bind:value={deadline}
                                class:input-error={deadlineError}
                            />

                            <input
                                type="text"
                                bind:value={name}
                                placeholder={$currentTranslations.assignments
                                    .name}
                                class="assignment-name-input {nameError
                                    ? 'input-error'
                                    : ''}"
                            />
                            <button
                                class="button"
                                on:click={(event) => createAssignment()}
                                >{$currentTranslations.assignments
                                    .create}</button
                            >
                        </div>
                    </div>

                    <div class="columns">
                        <LearningPathsColumn />

                        <StudentsGroupsColumn {classId} {groupError} />
                    </div>
                </div>
            </div>
        </div>
        <!--<Footer />-->
        <Footer />
    {:else}
        <p class="error">{$currentTranslations.assignments.errorUserData}</p>
    {/if}
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        min-height: 100vh; /* Full viewport height */
    }

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    .container {
        height: 100vh;
        display: flex;
        flex-direction: column;
        padding-top: 50px;
    }

    .title-container {
        flex: 0;
        padding-left: 20px;
    }

    .button-container {
        display: flex;
        justify-content: space-between;
        padding-right: 20px;
        padding-left: 20px;
        gap: 10px; /* Space between sections */
    }

    .error-container {
        flex: 1;
        display: flex;
        align-items: center;
    }

    .inputs-container {
        display: flex;
        gap: 10px; /* Space between inputs and button */
    }

    .bottom {
        flex: 1;
        display: flex;
    }

    .drawer-container {
        flex: 0;
        display: flex;
        flex-direction: column;
        padding-top: 40px;
    }

    .columns {
        display: flex;
        gap: 20px; /* Spacing between columns */
        width: 100%;
        padding: 20px;
        flex: 1; /* Ensure columns fill the remaining height */
    }

    .assignment-content {
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    .title {
        font-family: "C059-Roman";
        font-size: 4rem;
        justify-content: top; /* Center vertically */
    }

    .assignment-name-input {
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        font-size: 16px;
        width: 290px; /* Adjust width as needed */
    }

    .assignment-name-input::placeholder,
    input[type="date"]::placeholder {
        color: #888; /* Default placeholder color */
        opacity: 1; /* Ensure full opacity */
    }

    p {
        font-family: sans-serif;
        font-size: 1.1rem;
    }

    .error {
        color: var(--red-dark);
        font-size: 1rem;
        text-align: center;
        margin-top: 20px;
    }

    .input-error {
        border: 2px solid var(--red-dark);
    }

    .button {
        background: #43a047;
        color: white;
        padding: 12px 18px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 16px;
        font-weight: bold;
        transition:
            background 0.3s,
            transform 0.2s;
    }

    label {
        align-self: center;
    }
</style>
