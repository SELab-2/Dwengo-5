<script lang="ts">
    import { onMount } from "svelte";
    import Header from "../../lib/components/layout/Header.svelte";
    import Drawer from "../../lib/components/features/Drawer.svelte";
    import Avatar from "../../lib/components/ui/Avatar.svelte";
    import { user } from "../../lib/stores/user.ts";
    import { routeTo } from "../../lib/route.ts";
    import { apiRequest } from "../../lib/api";
    import { currentTranslations } from "../../lib/locales/i18n";
    import { conversationStore } from "../../lib/stores/conversation.ts";

    let id: string | null = null;
    const role = $user.role;
    
    let navigation_items: string[] = ["Members", "Assignments"];
    let navigation_paths: string[] = ["classroom", "assignments"]

    let active: string = "Members";
    let classData : any = null;
    let classId : string = "";
    let classroom : any = null;

    let allAcceptedMembers : any[] = [];
    let acceptedMembers = [...allAcceptedMembers];

    //Dummy
    let pendingRequests: any[] = [
        { id: "1", username: "Student3", role: "student" },
        { id: "2", username: "Student4", role: "student" }
    ];

    onMount(async () => {
        const hash = window.location.hash;
        const queryString = hash.split('?')[1];
        if (queryString) {
            const urlParams = new URLSearchParams(queryString);
            id = urlParams.get('id');
        }

        classId = hash.split('?')[0].split('/')[2];
        classData = await apiRequest(`/classes/${classId}`, 'GET');
        let students = await apiRequest(`/classes/${classId}/students`, 'GET');
        let teachers = await apiRequest(`/classes/${classId}/teachers`, 'GET');

        //let studentsWaiting = await apiRequest(`/classes/${classId}/waitingroom/students`, 'GET');
        //let teachersWaiting = await apiRequest(`/classes/${classId}/waitingroom/teachers`, 'GET');

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

        if (classId && role === "teacher") {  
            const conversationResp = await apiRequest(`/classes/${classId}/conversations`, 'GET');

            let conversations = [];

            for (let i = 0; i < conversationResp.conversations.length; i++) {
                const actualConversation = conversationResp.conversations[i];
                const conversationData = await apiRequest(`${actualConversation}`, "GET");
                const messagesData = await apiRequest(`${conversationData.links.messages}`, "GET");

                const authorUrl = messagesData.messages?.[0]?.zender; // Get the author of the first message
                let authorData = null; // Possible that author isn't known

                if (authorUrl) {
                    authorData = await apiRequest(`${authorUrl}`, "GET");
                }

                const assignment = await apiRequest(`${actualConversation.match(/^\/classes\/\d+\/assignments\/\d+/)[0]}`, "GET");

                conversations.push({
                    link: actualConversation,
                    title: conversationData.title,
                    assignment: assignment.name || "N/A",
                    update: conversationData.update || "Unknown",       // Last update of conversation, not yet callable
                    author: authorData ? `${authorData.name} (Group ${conversationData.group})` : `Group ${conversationData.group}`
                });
            }

            classroom = {
                name: classData.name,
                conversations: conversations
            };
        }

    });

    function toggleAcceptedRole(role: string) {
        if (role === "teacher") {
            acceptedMembers = allAcceptedMembers.filter(member => member.role === "teacher");
        } else if (role === "student") {
            acceptedMembers = allAcceptedMembers.filter(member => member.role === "student");
        } else {
            acceptedMembers = [...allAcceptedMembers]; // Restore full list
        }
    }

    let filteredPendingRequests = pendingRequests;
    let selectedPendingRole = "all"; // Default to showing all

    function togglePendingRole(role) {
        selectedPendingRole = role;

        if (role === "all") {
            filteredPendingRequests = pendingRequests;
        } else {
            filteredPendingRequests = pendingRequests.filter(req => req.role === role);
        }
    }

    async function acceptRequest(id: string, username: string, role: string) {
    
        /* POST not yet implemented for class (in controller)
        await apiRequest(`/classes/${classId}/${role}s`, 'POST', {
            body: JSON.stringify({ student: `${role}s/${id}` })
        });*/

        pendingRequests = pendingRequests.filter(request => request.id !== id || request.role !== role);
        acceptedMembers = [...acceptedMembers, { id, username, role }];
    }

    async function rejectRequest(id: string, role: string, type: string) {
        if(type === "member") {
            await apiRequest(`/classes/${classId}/${role}s/${id}`, 'DELETE');
            acceptedMembers = acceptedMembers.filter(request => (request.id !== id || request.role !== role));
        } else {
            //await apiRequest(`/classes/${classId}/waitingroom/${role}s/${id}`, 'DELETE');
            pendingRequests = pendingRequests.filter(request => (request.id !== id || request.role !== role));
        }
    }

    let sortedByAssignment: boolean = false;
    let sortedByDate: boolean = false;

    function sortQuestions(type: string) {
        if (!classroom || !classroom.conversations) return; // Ensure classroom exists

        if (type === 'assignment') {
            classroom.conversations = [...classroom.conversations].sort((a, b) => {
                return sortedByAssignment
                    ? a.assignment.localeCompare(b.assignment)
                    : b.assignment.localeCompare(a.assignment);
            });
            sortedByAssignment = !sortedByAssignment;
        }

        if (type === 'date') {
            classroom.conversations = [...classroom.conversations].sort((a, b) => {
                return sortedByDate
                    ? new Date(a.update).getTime() - new Date(b.update).getTime()
                    : new Date(b.update).getTime() - new Date(a.update).getTime();
            });
            sortedByDate = !sortedByDate;
        }
    }

    function goToConversation(conversation) {
        console.log(conversation);
        
        conversationStore.set(conversation);
        routeTo(`conversations/${conversation.link.split("/")[8]}`);
    }

</script>

<main>
    <Header/>

    <div class="content-container">
        <!-- Sidebar Navigation -->
        <Drawer navigation_items={["members","assignments"]} navigation_paths={[`classrooms/${classId}`, `classrooms/${classId}/assignments`]} active="members"/>

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
                                    <td>{$currentTranslations.classroom[member.role]}</td>
                                    {#if role === "teacher"}
                                        <td class="actions">
                                            {#if (member.id !== id || member.role !== "teacher")}
                                                <button class="icon-button reject" on:click={() => rejectRequest(member.id, member.role, "member")} aria-label="Reject request">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                        <path d="M18 6 6 18M6 6l12 12"/>
                                                    </svg>
                                                </button>
                                            {/if}
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
                        <div class="table-header">
                            <h2>{$currentTranslations.classroom.pending}</h2>
                            <div class="filter-buttons">
                                <button on:click={() => togglePendingRole("teacher")}>{$currentTranslations.classroom.show} {$currentTranslations.classroom.teachers}</button>
                                <button on:click={() => togglePendingRole("student")}>{$currentTranslations.classroom.show} {$currentTranslations.classroom.students}</button>
                                <button on:click={() => togglePendingRole("all")}>{$currentTranslations.classroom.show} {$currentTranslations.classroom.all}</button>
                            </div>
                        </div>
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
                                            <button class="icon-button accept" on:click={() => acceptRequest(request.id, request.username, request.role)} aria-label="Accept request">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--dwengo-green)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                    <path d="M20 6 9 17l-5-5"/>
                                                </svg>
                                            </button>
                                            <button class="icon-button reject" on:click={() => rejectRequest(request.id, request.role, "request")} aria-label="Reject request">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
    {#if role === "teacher"}
        <!-- Questions Table -->
        <div class="tables-container">
            <section class="table-section">
                <h2>{$currentTranslations.questions.questions}</h2>

                {#if classroom}
                    <table>
                        <thead>
                            <tr>
                                <th>{$currentTranslations.questions.topic}</th>
                                <th class="sortable" on:click={() => sortQuestions('assignment')}>
                                    {$currentTranslations.questions.assignment}
                                    {#if sortedByAssignment === false}↓{/if}
                                    {#if sortedByAssignment === true}↑{/if}
                                </th>
                                <th class="sortable" on:click={() => sortQuestions('date')}>
                                    {$currentTranslations.questions.update}
                                    {#if sortedByDate === false}↓{/if}
                                    {#if sortedByDate === true}↑{/if}
                                </th>
                                <th>{$currentTranslations.questions.author}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#if classroom.conversations.length > 0}
                                {#each classroom.conversations as conversation}
                                    <tr on:click={() => goToConversation(conversation)}>
                                        <td>{conversation.title}</td>
                                        <td>{conversation.assignment}</td>
                                        <td>{conversation.update}</td>
                                        <td>{conversation.author}</td>
                                    </tr>
                                {/each}
                            {:else}
                                <tr>
                                    <td colspan="4" style="text-align: center;">{$currentTranslations.questions.notPosted}</td>
                                </tr>
                            {/if}
                        </tbody>
                    </table>
                {:else}
                    <p>{$currentTranslations.questions.notFound}</p>
                {/if}
            </section>
        </div>
    {/if}
</main>

<style>

    .icon-button {
        border: none;
        background: none;
        cursor: pointer;
        padding: 5px;
    }

    .accept {
        background-color: transparent;
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        cursor: pointer;
    }

    .reject {
        background-color: transparent;
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        cursor: pointer;
    }

    .content-container {
        display: flex;
        align-items: flex-start;
        gap: 20px;
        padding: 20px;
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

    .table-section table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px; /* Optional: Adjust margin to create space */
    }

    .tables-container {
        display: flex;
        width: 100%;
        gap: 20px;
        overflow-x: auto;
    }

    .table-section {
        flex: 1;
        background: white;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        overflow-x: auto;
        max-height: 800px;
        overflow-y: auto;
    }

    .table-section h2 {
        margin-bottom: 10px;
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

    tr {
        cursor: pointer;
    }

    .filter-buttons button {
        margin-bottom: 5px;
        padding: 8px 12px;
        border: none;
        cursor: pointer;
        background: green;
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
