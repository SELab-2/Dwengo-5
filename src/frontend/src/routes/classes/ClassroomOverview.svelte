<script lang="ts">
    import { onMount } from "svelte";
    import Header from "../../lib/components/layout/Header.svelte";
    import Footer from "../../lib/components/layout/Footer.svelte";
    import { currentTranslations } from "../../lib/locales/i18n";
    import { apiRequest } from "../../lib/api";
    import { user } from "../../lib/stores/user.ts";
    import { routeTo } from "../../lib/route.ts";
    import type { ClassDetails } from "../../lib/types/types.ts";

    $: translatedTitle = $currentTranslations.classrooms.classroom
      .replace("{klassen}", `<span style="color:#80cc5d">klassen</span><br>`)
      .replace("{classrooms}", `<span style="color:#80cc5d">classrooms</span><br>`);

    let id: string | null = null;
    let errorClassrooms: string | null = null;
    let loadingClasses: boolean = false;
    const role = $user.role;

    let error: string | null = null;
    let loading = true;
    let editingMode = false;

    let editingClassId: string | null = null;
    let editedClassNames: Record<string, string> = {};

    let classrooms: { id: string, details: ClassDetails }[] = [];
    let showCreateClass = false;
    let className = "";

    let searchQuery: string = '';  // For filtering classes

    async function fetchClasses() {
        if (!id) return;
        try {
            loadingClasses = true;
            const response = await apiRequest(`/users/${id}/classes`, "GET");
            let classUrls = response.classes;
            
            classrooms = await Promise.all(
                classUrls.map(async (url: string) => {
                    const classId = url.split("/").pop();
                    const details = await apiRequest(`/classes/${classId}`, "GET");

                    return {
                        id: classId,
                        details: details,
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
            await apiRequest(`/classes/`, "POST", { 
                body: JSON.stringify({
                    name: className,
                    teacher: `/users/${id}`
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

    async function updateClassName(classId: string) {
        const newName = editedClassNames[classId]?.trim();
        if (!newName) return;

        try {
            /* PATCH for classroom name doesn't exist yet
            await apiRequest(`/classes/${classId}`, "PATCH", {
                body: JSON.stringify({ name: newName })
            });*/

            // Update local state
            const classIndex = classrooms.findIndex(c => c.id === classId);
            if (classIndex !== -1) {
                classrooms[classIndex].details.name = newName;
            }

            editingClassId = null; // Close editing
        } catch (err) {
            console.error("Failed to update class name:", err);
            errorClassrooms = "Failed to update class name.";
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

    function toggleEdit(classId: string) {
        editingClassId = editingClassId === classId ? null : classId;
        if (editingClassId !== null) {
            const classObj = classrooms.find(c => c.id === String(classId));
            if (classObj) {
                editedClassNames[classObj.id] = classObj.details.name;
            }
        }
    }

</script>

<main>
    <Header/>

    <div class="container">
        <div class="title-container">
            <p class="title">{ @html translatedTitle }</p>
        </div>
        <div class="bottom">
        
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
                
                    <div class="search-container">
                        <input 
                            type="text" 
                            bind:value={searchQuery} 
                            placeholder={$currentTranslations.classrooms.fill}
                            class="search-input" 
                        />
                    </div>
                </div>
                
                {#if showCreateClass}
                    <div class="fixed-create">
                        <input type="text" bind:value={className} placeholder={$currentTranslations.classrooms.enter} class="input-field"/>
                        <button class="btn submit" on:click={createClass}>{$currentTranslations.classrooms.create}</button>
                    </div>
                {/if}

                <div class="class-list">
                    {#if loadingClasses}
                        <p>{$currentTranslations.classrooms.loading}</p>
                    {:else if errorClassrooms}
                        <p class="empty-message">{errorClassrooms}</p>
                    {:else if classrooms.length > 0}
                        {#if role === "teacher"}
                            <button class="btn edit" on:click={() => editingMode = !editingMode}>
                                ✏️ {editingMode ? $currentTranslations.classrooms.done : $currentTranslations.classrooms.edit}
                            </button>
                        {/if}
                        
                        {#if classrooms.filter(c => c.details.name.toLowerCase().includes(searchQuery.toLowerCase())).length > 0}
                            {#each classrooms.filter(c => c.details.name.toLowerCase().includes(searchQuery.toLowerCase())) as classObj}
                                <div class="class-card">
                                    {#if editingMode && editingClassId === classObj.id}
                                        <input
                                            type="text"
                                            class="input-field"
                                            bind:value={editedClassNames[classObj.id]}
                                            on:blur={() => updateClassName(classObj.id)}
                                            on:keydown={(e) => e.key === 'Enter' && updateClassName(classObj.id)}
                                        />
                                    {:else}
                                        <div class="name-container">
                                            <h3>{classObj.details.name}</h3>
                                            {#if role === "teacher" && editingMode }
                                                <button class="btn editName" on:click={() => toggleEdit(classObj.id)}>
                                                    ✏️
                                                </button>
                                            {/if}
                                        </div>
                                    {/if}
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
                            <p class="empty-message">{$currentTranslations.classrooms.notFound}</p>
                        {/if}
                    {:else}
                        <p class="empty-message">{$currentTranslations.classrooms.enrolled}</p>
                    {/if}
                </div>
            </section>
        </div>
    </div>
    <Footer/>
</main>

<style>
    .title-container {
        flex: 0;
        padding-left: 20px;
    }

    .name-container {
        display: flex;
        gap: 12px;
    } 

    .content {
		flex: 1;
		background-color: white;
		margin-left: 100px;
		margin-right: 100px;
		border-radius: 15px;
		border: 15px solid var(--dwengo-green);
		padding-left: 15px;
		padding-right: 15px;
		padding-top: 10px;
		padding-bottom: 10px;
		max-height: 70vh; /* Adjust height as needed */
		overflow-y: auto; /* Enables vertical scrolling */
  	}
    
    .actions {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
        align-items: center;
    }

    .search-container {
        flex-grow: 1;
    }

    .search-input {
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 6px;
        font-size: 16px;
        width: 100%;
        box-sizing: border-box;
    }

    .btn.join,
    .btn.create,
    .btn.submit,
    .btn.edit,
    .btn.submit,
    .btn.view,
    .btn.delete {
        padding: 12px 18px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 16px;
        font-weight: bold;
        transition: background 0.3s, transform 0.2s;
    }

    .btn.editName {
        background: none;
        border: none;
        cursor: pointer;
    } 

    .btn.join:hover {
        background: lightgray;
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
        background: var(--dwengo-green);
    }

    .btn.edit {
        background: #fbc02d;
        color: white;
    }

    .btn.edit:hover {
        background: orange;
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
        width: fit-content;
        padding-left: 16px;
        padding-right: 16px;
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
