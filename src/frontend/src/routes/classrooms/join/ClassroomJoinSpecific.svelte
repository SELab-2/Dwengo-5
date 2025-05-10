<script lang="ts">
    import { onMount } from "svelte";
    import Header from "../../../lib/components/layout/Header.svelte";
    import { user } from "../../../lib/stores/user.ts";
    import { routeTo } from "../../../lib/route.ts";
    import { apiRequest } from "../../../lib/api";
    import { currentTranslations } from "../../../lib/locales/i18n";
    import type { ClassDetails, Teacher } from "../../../lib/types/types.ts";

    let id: string | null = null;
    const role = $user.role;

    let classDetails : ClassDetails | null = null;
    let classTeachers : Teacher[] = [];
    let classId : string = "";

    let error: string | null = null;
    let successful : string | null = null;

    onMount(async () => {
        const hash = window.location.hash;
        const queryString = hash.split("?")[1];

        if (queryString) {
            const urlParams = new URLSearchParams(queryString);
            id = urlParams.get("id");
        } else {
            error = "Invalid role or ID parameters!";
            return;
        }

        classId = hash.split("/")[3].split("?")[0];

        try {
            classDetails = await apiRequest(`/classes/${classId}`, "GET");
            
            let classTeachersLinks;
            if(classDetails) classTeachersLinks = await apiRequest(`${classDetails.links.teachers}`, "GET");
            
            for (let i = 0; i < classTeachersLinks.teachers.length; i++) {
                const teacher = await apiRequest(`${classTeachersLinks.teachers[i]}`, "GET");
                classTeachers = [...classTeachers, teacher];
            }
        } catch (err: any) {
            error = err?.error ?? "An unexpected error occurred.";
        }
    });

    async function joinClass(role: string) {
        successful = "successful";
        if(role === "teacher") {
            await apiRequest(`/classes/${classId}/waitingroom/teachers`, "POST", { 
                body: JSON.stringify({
                    teacher: `/teachers/${id}`
                })
            });
        } else {
            await apiRequest(`/classes/${classId}/waitingroom/students`, "POST", { 
                body: JSON.stringify({
                    student: `/students/${id}`
                })
            });
        }
    }

</script>
    
<main class="page-container">
    <Header/>
    <div class="card">
        <!--p class="prompt">Do you want to join</p>
        <h2 class="class-name">Class: {classDetails.name}</h2>

        <div class="teachers">
            <h3 class="teacher-title">Taught by:</h3>
            {#each classTeachers as classTeacher}
                <p class="teacher-name">{classTeacher.name}</p>
            {/each}
        </div!-->

        <div class="button-row">
            <button class="cancel-btn" on:click={() => routeTo("/classrooms")}>
                {$currentTranslations.join.back}
            </button>
            <button class="join-btn" on:click={() => joinClass(role)}>
                {$currentTranslations.join.join}
            </button>
        </div>
    </div>
    {#if error}
        <div class="error-message">{$currentTranslations.join.error1}</div>
    {/if}
    {#if successful}
        <div class="success-message">{$currentTranslations.join[successful]}</div>
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

    .error-message, .success-message {
        padding: 1rem;
        margin: 1rem auto;
        border-radius: 8px;
        text-align: center;
        max-width: 500px;
    }

    .error-message {
        color: #b00020;
        background-color: #ffe5e5;
    }

    .success-message {
        color: green;
        background-color: #bdebbd;
    }
</style>
