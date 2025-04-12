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
    let errorClassrooms: string | null = null;
    let loadingClasses: boolean = false;
    const role = $user.role;

    let error: string | null = null;
    let loading = true;
    let editingMode = false;

    let classrooms: { id: string, details: any }[] = [];
    let showCreateClass = false;
    let className = "";

    let navigation_items = $user.role === "teacher" ? ["dashboard", "questions"] : [];
      let navigation_paths = $user.role === "teacher" ? ["dashboard", "questions"] : []

      navigation_items = [...navigation_items, "classrooms", "assignments", "catalog"];
      navigation_paths = [...navigation_paths, "classrooms", "assignments", "catalog"];

    async function fetchClasses() {
        if (!id) return;
        try {
            loadingClasses = true;
            const response = await apiRequest(`/${role}s/${id}/classes`, "GET");
            let classUrls = response.classes;
            
            classrooms = await Promise.all(
                classUrls.map(async (url: any) => {
                    const classId = url.split("/").pop();
                    return {
                        id: classId,
                        details: await apiRequest(`/classes/${classId}`, "GET")
                    };
                })
            );

            loadingClasses = false;
        } catch (err) {
            errorClassrooms = "Failed to fetch classrooms.";
            loadingClasses = false;
        }
    }

    async function createClass() {
        if (!className.trim()) return; // Prevent empty submissions
        try {
            const response = await apiRequest(`/classes/`, "POST", { 
                body: JSON.stringify({
                    name: className,
                    teacher: `/teachers/${id}`
                })
            });

            // Fetch the updated list of classrooms again to get the new class with its proper ID
            await fetchClasses();

            className = ""; // Reset input
            showCreateClass = false; // Close dropdown
        } catch (err) {
            console.error("Failed to create class:", err);
            errorClassrooms = "Failed to create class.";
        }
    }

    async function deleteClass(classId: string) {
        try {
            await apiRequest(`/classes/${classId}`, "DELETE");
            
            classrooms = classrooms.filter(classObj => classObj.id !== classId);
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
        <Drawer navigation_items={navigation_items} navigation_paths={navigation_paths} active="classrooms"/>

        <section class="content">
            <div class="actions">
                {#if role === "teacher"}
                    <button class="btn create" on:click={() => showCreateClass = !showCreateClass}>
                        + {$currentTranslations.classrooms.create}
                    </button>
                {/if}
                <button class="btn join" on:click={() => routeTo('/classrooms/join')}>
                    🔗 {$currentTranslations.classrooms.join}
                </button>
            </div>
            {#if showCreateClass}
                <div class="fixed-create">
                    <input type="text" bind:value={className} placeholder="Enter class name" class="input-field"/>
                    <button class="btn submit" on:click={createClass}>Create</button>
                </div>
            {/if}

            <h2>{$currentTranslations.classrooms.classroom}</h2>

            <div class="class-list">
                {#if loadingClasses}
                    <p>{$currentTranslations.classrooms.loading}</p>
                {:else if errorClassrooms}
                    <p class="empty-message">{errorClassrooms}</p>
                {:else if classrooms.length > 0}
                    {#if role === "teacher"}
                        <button class="btn edit" on:click={() => editingMode = !editingMode}>
                            ✏️ {$currentTranslations.classrooms.edit} {editingMode ? $currentTranslations.classrooms.done : $currentTranslations.classrooms.edit}
                        </button>
                    {/if}
                    {#each classrooms as classObj}
                        <div class="class-card">
                            <h3>{classObj.details.name}</h3>
                            <div class="buttons">
                                <button class="btn view" on:click={() => routeTo('/classrooms', { id: classObj.id })}>
                                    {$currentTranslations.classrooms.view}
                                </button>
                                {#if role === "teacher" && editingMode}
                                    <button class="btn delete" on:click={() => deleteClass(classObj.id)}>
                                        ❌ {$currentTranslations.classrooms.delete}
                                    </button>
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

    .btn:hover {
        transform: scale(1.05);
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

    .btn.edit {
        background: #fbc02d;
        color: white;
    }

    .btn.edit:hover {
        background: #f9a825;
        transform: scale(1.05);
    }

    .fixed-create {
        background: #f9f9f9;
        border: 1px solid #ccc;
        border-radius: 12px;
        padding: 15px;
        margin-bottom: 20px;
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
        box-sizing: border-box;
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
