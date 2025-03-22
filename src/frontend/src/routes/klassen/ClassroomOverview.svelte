<script lang="ts">
    import { onMount } from "svelte";
    import Header from "../../lib/components/layout/Header.svelte";
    import Drawer from "../../lib/components/features/Drawer.svelte";
    import { currentTranslations } from "../../lib/locales/i18n";

    import { apiBaseUrl } from "../../config";
    import { apiRequest } from "../../lib/api";

    let role: string | null = null;
    let id: string | null = null;
    let studentClasses = null;
    let errorStudentClasses = null;
    let loadingStudentClasses = null;

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

            if ((role === "teacher" || role === "student") && id) {
                try {
                    loadingStudentClasses = true;
                    console.log(id);
                    const response = await apiRequest(`/${role}s/${id}/classes`);
                    let classUrls = response.classes;

                    console.log(classUrls);
                    
                    const classDetails = await Promise.all(
                        classUrls.map(async (url) => {
                            const classId = url.split("/").pop(); // Extract class ID
                            const classData = await apiRequest(`/classes/${classId}`);
                            return classData;
                        })
                    );

                    studentClasses = classDetails;
                    console.log(classDetails);

                    loadingStudentClasses = false;
                } catch (err) {
                    errorStudentClasses = "Failed to fetch student classes.";
                    console.log(errorStudentClasses);
                    loadingStudentClasses = false;
                }
            } else {
                error = "Invalid URL parameters!";
                console.log(error);
                loading = false;
            }

        } else {
            error = "Invalid URL parameters!";
            console.log(error);
            loading = false;
        }
    });

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
                {#if loadingStudentClasses}
                    <p>Loading...</p>
                {:else if errorStudentClasses}
                    <p class="empty-message">{errorStudentClasses}</p>
                {:else if studentClasses && studentClasses.length > 0}
                    {#each studentClasses as classs}
                        <div class="class-card">
                            <h3>{classs.name}</h3>
                            <!--p>Teacher: {classs.teacher}</p>
                            <p>Students: {classs.students}</p!-->
                            <div class="buttons">
                                <button class="btn view">View Class</button>
                            </div>
                        </div>
                    {/each}
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
