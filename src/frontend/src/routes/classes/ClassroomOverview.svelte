<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import Header from "../../lib/components/layout/Header.svelte";
    import Drawer from "../../lib/components/features/Drawer.svelte";
    import { currentTranslations } from "../../lib/locales/i18n";
    import { apiRequest } from "../../lib/api";
    import { user } from "../../lib/stores/user.ts";
    import { routeTo } from "../../lib/route.ts";

    let id: string | null = null;
    let classrooms: any[] = [];
    let errorClassrooms: string | null = null;
    let loadingClasses: boolean = false;
    let classIds: any[] = [];
    const role = $user.role;

    let error: string | null = null;
    let loading = true;

    let showCreateClass = false;  // Toggle dropdown
    let className = "";  // Input field value

    async function fetchClasses() {
        if (!id) return;
        try {
            loadingClasses = true;
            const response = await apiRequest(`/${role}s/${id}/classes`, "GET");
            let classUrls = response.classes;
            
            const classDetails = await Promise.all(
                classUrls.map(async (url: any) => {
                    const classId = url.split("/").pop(); // Extract class ID
                    classIds.push(classId);
                    return await apiRequest(`/classes/${classId}`, "GET");
                })
            );

            classrooms = classDetails;
            loadingClasses = false;
        } catch (err) {
            errorClassrooms = "Failed to fetch classes.";
            console.log(errorClassrooms);
            loadingClasses = false;
        }
    }

    async function createClass() {
        if (!className.trim()) return; // Prevent empty submissions

        try {
            /*
            const response = await apiRequest(`/classes`, "POST", { 
                name: className,
                teacher: `/teachers/${id}`
            }, {
                headers: { "Content-Type": "application/json" } // Explicitly define JSON type
            });*/
            //const newClassData = response.class;
            classrooms = [...classrooms, { name: className }]; // Update list
            className = ""; // Reset input
            showCreateClass = false; // Close dropdown
        } catch (err) {
            console.error("Failed to create class:", err);
            errorClassrooms = "Failed to create class.";
        }
    }

    async function deleteClass(classId: string, classIndex: string) {
        try {
            await apiRequest(`/classes/${classId}`, "DELETE");
            //Remove the deleted class from the list
            classIds = [...classIds.slice(0, classIndex), ...classIds.slice(classIndex + 1)];
            classrooms = [...classrooms.slice(0, classIndex), ...classrooms.slice(classIndex + 1)];

        } catch (err) {
            console.error("Failed to delete class:", err);
            errorClassrooms = "Failed to delete class.";
        }
    }

    onMount(async () => {
        const hash = window.location.hash;
        const queryString = hash.split("?")[1];

        if (queryString) {
            const urlParams = new URLSearchParams(queryString);
            id = urlParams.get("id");

            if ((role === "teacher" || role === "student") && id) {
                await fetchClasses();
            } else {
                error = "Invalid URL parameters!";
                console.log(error);
                loading = false;
            }
        } else {
            error = "Invalid role or ID parameters!";
            console.log(error);
            loading = false;
        }
    });


</script>

<main>
    <Header/>

    <div class="container">
        <Drawer navigation_items={["dashboard", "questions", "classrooms", "catalog"]} active="classrooms"/>

        <section class="content">
            <div class="actions">
                {#if role === "teacher"}
                    <!-- Toggle dropdown -->
                    <button class="btn create" on:click={() => showCreateClass = !showCreateClass}>
                        + {$currentTranslations.classrooms.create}
                    </button>
                {/if}
                <button class="btn join">🔗 {$currentTranslations.classrooms.join}</button>
            </div>

            <h2>{$currentTranslations.classrooms.classroom}</h2>

            <div class="class-list">
                {#if showCreateClass}
                    <div class="dropdown" transition:fade>
                        <input type="text" bind:value={className} placeholder="Enter class name" class="input-field"/>
                        <button class="btn submit" on:click={createClass}>Create</button>
                    </div>
                    {/if}
                {#if loadingClasses}
                    <p>{$currentTranslations.classrooms.loading}</p>
                {:else if errorClassrooms}
                    <p class="empty-message">{errorClassrooms}</p>
                {:else if classrooms.length > 0}
                    {#each classrooms as classs}
                        <div class="class-card">
                            <h3>{classs.name}</h3>
                            <div class="buttons">
                                <button class="btn view" on:click={() => routeTo('classrooms', { id: classIds[classrooms.indexOf(classs)] })}>
                                    {$currentTranslations.classrooms.view}
                                </button>
                                {#if role === "teacher"}
                                    <button class="btn delete" on:click={() => deleteClass(classIds[classrooms.indexOf(classs)], classrooms.indexOf(classs))}>✖️ {$currentTranslations.classrooms.delete}</button>
                                {/if}
                            </div>
                        </div>
                    {/each}
                {:else}
                    <p class="empty-message">{$currentTranslations.classrooms.enrolled}</p>
                {/if}
            </div>
        </section>
    </div>
</main>

<style>
    .container {
        display: flex;
        height: calc(100vh - 80px);
        background: white;
    }

    .content {
        flex: 1;
        background: white;
        padding: 20px;
        overflow-y: auto;
    }

    .actions {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
        align-items: center;
    }

    .btn {
        padding: 12px 18px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 16px;
        font-weight: bold;
        transition: background 0.3s, transform 0.2s;
    }

    .btn.create {
        background: #388e3c;
        color: white;
    }

    .btn.create:hover {
        background: #2e7d32;
        transform: scale(1.05);
    }

    .btn.submit {
        background: #1b5e20;
        color: white;
        width: 100%;
    }

    .btn.submit:hover {
        background: #145a32;
        transform: scale(1.05);
    }

    .dropdown {
        background: white;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
        padding: 10px;
        border-radius: 8px;
        position: absolute;
        top: 50px;
        left: 0;
        width: 250px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .input-field {
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 6px;
        font-size: 16px;
        width: 100%;
    }

    .class-list {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .class-card {
        background: white;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        text-align: left;
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .buttons {
        display: flex;
        gap: 10px;
        margin-top: 10px;
    }

    .btn.view {
        background: #1b5e20;
        color: white;
    }

    .btn.view:hover {
        background: #145a32;
        transform: scale(1.05);
    }

    .empty-message {
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        color: #757575;
        margin-top: 20px;
    }
</style>
