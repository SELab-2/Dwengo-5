<script lang="ts">
    import { onMount } from "svelte";
    import Header from "../../lib/components/layout/Header.svelte";
    import Drawer from "../../lib/components/features/Drawer.svelte";
    import { currentTranslations } from "../../lib/locales/i18n";

    import { apiBaseUrl } from "../../config";
    import { apiRequest } from "../../lib/api";

    let role: string | null = null;
    let id: string | null = null;

    let user: any = null;
    let error: string | null = null;
    let loading = true;

    onMount(async () => {
        const hash = window.location.hash;
        const queryString = hash.split('?')[1];
        if (queryString) {
            const urlParams = new URLSearchParams(queryString);
            role = urlParams.get('role');
            id = urlParams.get('id');

            if (role === "teacher" && id) {
                try {
                    loadingStudentClasses = true;
                    const response = await apiRequest(`${apiBaseUrl}/leerkrachten/${id}/klassen`);
                    studentClasses = response.data;
                    console.log(studentClasses);

                    loadingStudentClasses = false;
                } catch (err) {
                    errorStudentClasses = "Failed to fetch student classes.";
                    loadingStudentClasses = false;
                }
            } else {
                error = "Invalid URL parameters!";
                loading = false;
            }

        } else {
            error = "Invalid URL parameters!";
            loading = false;
        }
    });

    // Dummy class data (only for teachers)
    let teacherClasses = [
        { id: 1, name: "Klas 1A", teacher: "Mr. Smith", students: 30 },
        { id: 2, name: "Klas 2A", teacher: "Dr. Johnson", students: 25 },
        { id: 3, name: "Klas 3D", teacher: "Ms. Adams", students: 20 },
    ];

</script>

<main>
    <Header role={role}/>

    <div class="container">
        <Drawer navigation_items={["dashboard","questions","classrooms", "catalog"]} active="classrooms"/>

        <!-- Main content -->
        <section class="content">
            <div class="actions">
                {#if role === "teacher"}
                    <button class="btn create">+ Create Class</button>
                {/if}
                <button class="btn join">🔗 Join Class</button>
            </div>

            <h2>{role === "teacher" ? "Your Classes" : "Your Class"}</h2>

            <div class="class-list">
                {#if role === "teacher"}
                    {#if teacherClasses.length > 0}
                        {#each teacherClasses as classs}
                            <div class="class-card">
                                <h3>{classs.name}</h3>
                                <p>Teacher: {classs.teacher}</p>
                                <p>Students: {classs.students}</p>
                                <div class="buttons">
                                    <button class="btn view">View Class</button>
                                    <button class="btn delete" on:click={() => deleteClass(classs.id)}>🗑 Delete</button>
                                </div>
                            </div>
                        {/each}
                    {:else}
                        <p class="empty-message">You don't have any classes yet.</p>
                    {/if}
                {:else}
                    <p class="empty-message">You are not enrolled in any class.</p>
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

    .btn.join {
        background: #43a047;
        color: white;
    }

    .btn.join:hover {
        background: #388e3c;
        transform: scale(1.05);
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

    .btn.delete {
        background: #d32f2f;
        color: white;
    }

    .btn.delete:hover {
        background: #b71c1c;
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
