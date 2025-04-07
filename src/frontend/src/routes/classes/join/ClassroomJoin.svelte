<script lang="ts">
    import { onMount } from "svelte";
    import Header from "../../../lib/components/layout/Header.svelte";
    import Drawer from "../../../lib/components/features/Drawer.svelte";
    import { user } from "../../../lib/stores/user.ts";
    import { routeTo } from "../../../lib/route.ts";
    import { apiRequest } from "../../../lib/api";
    import { currentTranslations } from "../../../lib/locales/i18n";

    let id: string | null = null;
    const role = $user.role;

    let classDetails : any = null;
    let classTeachers : any = [];

    onMount(async () => {
        const hash = window.location.hash;
        const queryString = hash.split("?")[1];

        if (queryString) {

            const urlParams = new URLSearchParams(queryString);
            id = urlParams.get("id");

        } else {
            error = "Invalid role or ID parameters!";
            console.log(error);
            loading = false;
        }

        const classId = hash.split("/")[3].split("?")[0];
        classDetails = await apiRequest(`/classes/${classId}`, "GET");
        
        const classTeachersLinks = await apiRequest(`${classDetails.links.teachers}`, "GET");
        for(let i = 0; i < classTeachersLinks.teachers.length; i++) {
            classTeachers = [...classTeachers, await apiRequest(`${classTeachersLinks.teachers[i]}`, "GET")]
        }

    });
</script>
    
<main class="page-container">
    <Header/>

    {#if classDetails !== null}
        <div class="card">
            <p class="prompt">Do you want to join</p>
            <h2 class="class-name">Class: {classDetails.name}</h2>

            <div class="teachers">
                <h3 class="teacher-title">Taught by:</h3>
                {#each classTeachers as classTeacher}
                    <p class="teacher-name">{classTeacher.name}</p>
                {/each}
            </div>

            <div class="button-row">
                <button class="cancel-btn" on:click={() => routeTo("/classrooms")}>
                    Go back to your classrooms
                </button>
                <button class="join-btn" on:click={() => console.log("Join class logic here")}>
                    Join Class
                </button>
            </div>
        </div>
    {/if}
</main>

<style>
    .page-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 2rem;
        background: #f7f9fc;
        min-height: 100vh;
    }

    .card {
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        padding: 2rem;
        max-width: 500px;
        width: 100%;
        text-align: center;
        animation: fadeIn 0.4s ease-in;
    }

    .prompt {
        font-size: 1.1rem;
        color: #666;
        margin-bottom: 0.5rem;
    }

    .class-name {
        font-size: 1.8rem;
        color: #333;
        margin-bottom: 1.5rem;
    }

    .teachers {
        margin-top: 1rem;
        background: #f1f5f9;
        padding: 1rem;
        border-radius: 8px;
    }

    .teacher-title {
        margin-bottom: 0.5rem;
        font-size: 1.2rem;
        color: #444;
    }

    .teacher-name {
        margin: 0.2rem 0;
        font-weight: 500;
        color: #2c7a7b;
    }

    .button-row {
        margin-top: 1.5rem;
        display: flex;
        justify-content: center;
        gap: 1rem;
    }

    .join-btn, .cancel-btn {
        padding: 10px 20px;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .join-btn {
        background-color: #4CAF50;
        color: white;
    }

    .join-btn:hover {
        background-color: #43a047;
    }

    .cancel-btn {
        background-color: #e0e0e0;
        color: #333;
    }

    .cancel-btn:hover {
        background-color: #d5d5d5;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
