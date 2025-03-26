<script lang="ts">
    import { onMount } from "svelte";
    import Header from "../../lib/components/layout/Header.svelte";
    import Drawer from "../../lib/components/features/Drawer.svelte";
    import Avatar from "../../lib/components/ui/Avatar.svelte";
    import { user } from "../../lib/stores/user.ts";
    import { routeTo } from "../../lib/route.ts";
    import { apiRequest } from "../../lib/api";
    import { currentTranslations } from "../../lib/locales/i18n";

    let id: string | null = null;
    const role = $user.role;
    
    let navigation_items: string[] = ["Members", "Assignments"];
    let active: string = "Members";
    let classData : any = null;

    let allAcceptedMembers : any[] = [];

    let pendingRequests: any[] = [
        { id: "3", username: "Student3", role: "student" },
        { id: "4", username: "Student4", role: "student" }
    ];

    let acceptedMembers = [...allAcceptedMembers];

    function toggleAcceptedRole(role: string) {
        if (role === "teacher") {
            acceptedMembers = allAcceptedMembers.filter(member => member.role === "teacher");
        } else if (role === "student") {
            acceptedMembers = allAcceptedMembers.filter(member => member.role === "student");
        } else {
            acceptedMembers = [...allAcceptedMembers]; // Restore full list
        }
    }

    onMount(async () => {
        const hash = window.location.hash;
        const queryString = hash.split('?')[1];
        if (queryString) {
            const urlParams = new URLSearchParams(queryString);
            id = urlParams.get('id');
        }

        const classId = hash.split('?')[0].split('/')[2];
        classData = await apiRequest(`/classes/${classId}`, 'GET');
        let students = await apiRequest(`/classes/${classId}/students`, 'GET');
        let teachers = await apiRequest(`/classes/${classId}/teachers`, 'GET');

        for(let i = 0; i < teachers.teachers.length; i++) {
            let studentId = teachers.teachers[i].split('/')[2];
            let studentData = await apiRequest(`/teachers/${studentId}`, 'GET');
            acceptedMembers = [...acceptedMembers, { id: `${studentId}`, username: `${studentData.name}`, role: "teacher" }];
        }

        for(let i = 0; i < students.students.length; i++) {
            let studentId = students.students[i].split('/')[2];
            let studentData = await apiRequest(`/students/${studentId}`, 'GET');
            acceptedMembers = [...acceptedMembers, { id: `${studentId}`, username: `${studentData.name}`, role: "student" }];
        }

        allAcceptedMembers = [...acceptedMembers];

    });

    function acceptRequest(id: string) {
        console.log("Accepted user with ID:", id);
    }

    function rejectRequest(id: string) {
        console.log("Rejected user with ID:", id);
    }
</script>

<main>
    <Header/>

    <div class="content-container">
        <!-- Sidebar Navigation -->
        <Drawer navigation_items={["members","assignments"]} active="members"/>

        <!-- Main Content -->
        <div class="main-content">
            <!-- Back Button -->
            <button class="back-button" on:click={() => routeTo('classrooms')}>&larr; {$currentTranslations.classroom.back}</button>

            <!-- Class Header with Join Code on the Right -->
            <div class="class-header">
                <h1>{#if classData}{$currentTranslations.classroom.classroom}: {classData.name}{:else}{$currentTranslations.classroom.loading}...{/if}</h1>
                <div class="join-code">
                    <p>{$currentTranslations.classroom.join}:</p>
                    <span class="code-box">{id}-XYZ123</span>
                </div>
            </div>

            <!-- Tables Wrapper -->
            <div class="tables-container">
                <!-- Accepted Members Table -->
                <section class="table-section">
                    <h2>{$currentTranslations.classroom.members}</h2>
                    <div class="filter-buttons">
                        <button on:click={() => toggleAcceptedRole("teacher")}>{$currentTranslations.classroom.show} {$currentTranslations.classroom.teachers}</button>
                        <button on:click={() => toggleAcceptedRole("student")}>{$currentTranslations.classroom.show} {$currentTranslations.classroom.students}</button>
                        <button on:click={() => toggleAcceptedRole("all")}>{$currentTranslations.classroom.show} {$currentTranslations.classroom.all}</button>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>{$currentTranslations.classroom.avatar}</th>
                                <th>{$currentTranslations.classroom.username}</th>
                                <th>{$currentTranslations.classroom.role}</th>
                                {#if role === "teacher"}
                                    <th>{$currentTranslations.classroom.actions}</th>
                                {/if}
                            </tr>
                        </thead>
                        <tbody>
                            {#each acceptedMembers as member}
                                <tr>
                                    <td><Avatar name={member.username}/></td>
                                    <td>{member.username}</td>
                                    <td>{member.role}</td>
                                    {#if role === "teacher"}
                                        <td class="actions">
                                            <button class="icon-button reject" on:click={() => rejectRequest(request.id)} aria-label="Reject request">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                    <path d="M18 6 6 18M6 6l12 12"/>
                                                </svg>
                                            </button>
                                        </td>
                                    {/if}
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </section>

                <!-- Pending Requests Table -->
                {#if role === "teacher"}
                    <section class="table-section">
                        <h2>{$currentTranslations.classroom.pending}</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>{$currentTranslations.classroom.avatar}</th>
                                    <th>{$currentTranslations.classroom.username}</th>
                                    <th>{$currentTranslations.classroom.role}</th>
                                    <th>{$currentTranslations.classroom.actions}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each pendingRequests as request}
                                    <tr>
                                        <td><Avatar name={request.username}/></td>
                                        <td>{request.username}</td>
                                        <td>{request.role}</td>
                                        <td class="actions">
                                            <button class="icon-button accept" on:click={() => acceptRequest(request.id)} aria-label="Accept request">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                    <path d="M20 6 9 17l-5-5"/>
                                                </svg>
                                            </button>
                                            <button class="icon-button reject" on:click={() => rejectRequest(request.id)} aria-label="Reject request">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                    <path d="M18 6 6 18M6 6l12 12"/>
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </section>
                {/if}
            </div>
        </div>
    </div>
</main>

<style>
    .container {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px;
        border-radius: 5px;
        transition: background-color 0.3s ease;
    }

    .icon-button {
        border: none;
        background: none;
        cursor: pointer;
        padding: 5px;
    }

    .accept {
        background-color: green;
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        cursor: pointer;
    }

    .reject {
        background-color: red;
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        cursor: pointer;
    }

    .nav-text {
        font-family: 'C059-Italic';
        color: black;
        text-decoration: none;
        font-size: 16px;
    }

    .content-container {
        display: flex;
        align-items: flex-start;
        gap: 20px;
        padding: 20px;
    }

    .sidebar {
        width: 220px;
        background: white;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .main-content {
        flex: 1;
        padding: 20px;
    }

    .back-button {
        background: none;
        border: none;
        font-size: 16px;
        cursor: pointer;
        color: var(--dwengo-green);
        margin-bottom: 10px;
    }

    h1 {
        font-size: 24px;
        margin-bottom: 10px;
    }

    .join-code {
        background: #f3f3f3;
        padding: 10px;
        border-radius: 5px;
        width: fit-content;
    }

    .code-box {
        font-weight: bold;
        background: white;
        padding: 5px 10px;
        border-radius: 4px;
        display: inline-block;
        margin-top: 5px;
    }

    .tables-container {
        display: flex;
        gap: 20px;
        margin-top: 20px;
    }

    .table-section {
        flex: 1;
        background: white;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    th, td {
        padding: 10px;
        text-align: left;
        border-bottom: 1px solid #ddd;
    }

    th {
        background-color: var(--dwengo-green);
        color: white;
    }

    .filter-buttons button {
        margin-bottom: 5px;
        padding: 5px 10px;
        border: none;
        cursor: pointer;
        background: var(--dwengo-green);
        color: white;
        border-radius: 4px;
    }

    .class-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }
</style>
