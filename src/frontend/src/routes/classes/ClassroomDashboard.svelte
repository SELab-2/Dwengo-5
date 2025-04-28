<script lang="ts">
    import { onMount } from "svelte";
    import Header from "../../lib/components/layout/Header.svelte";
    import Drawer from "../../lib/components/features/Drawer.svelte";
    import Avatar from "../../lib/components/ui/Avatar.svelte";
    import { user } from "../../lib/stores/user.ts";
    import { routeToItem } from "../../lib/route.ts";
    import { apiRequest } from "../../lib/api";
    import { currentTranslations } from "../../lib/locales/i18n";
    import { conversationStore } from "../../lib/stores/conversation.ts";
    import { routeTo } from "../../lib/route.ts";
    import type { Member, ClassData, Conversation } from "../../lib/types/types.ts";

    let id: string | null = null;
    const role = $user.role;
    
    let navigation_items: string[] = ["Dashboard", "Assignments"];

    let active: string = "Dashboard";
    let classData : ClassData | null = null;
    let classId : string = "";
    let classroom : ClassData | null = null;
    let joinLink : string = "";
    let copied = false;

    let allAcceptedMembers: Member[] = [];
    let acceptedMembers = [...allAcceptedMembers];

    let allPending: Member[] = [];
    let pendingRequests = [...allPending];

    function extractIdFromUrl(url: string) {
        return url.split("/")[2];
    }

    async function copyToClipboard() {
		try {
			await navigator.clipboard.writeText(joinLink);
			copied = true;
			setTimeout(() => copied = false, 2000);
		} catch (err) {
			console.error("Failed to copy!", err);
		}
	}

    async function fetchUsers(userType: "teachers" | "students", ids: string[], role: string) {
        return await Promise.all(
            ids.map(async (url) => {
                const id = extractIdFromUrl(url);
                const data = await apiRequest(`/${userType}/${id}`, "GET");
                return { id, username: data.name, role };
            })
        );
    }

    onMount(async () => {
        const hash = window.location.hash;
        const queryString = hash.split("?")[1];

        if (queryString) {
            const urlParams = new URLSearchParams(queryString);
            id = urlParams.get("id");
        }

        classId = hash.split("?")[0].split("/")[2];
        joinLink = `/classrooms/join/${classId}`;
        classData = await apiRequest(`/classes/${classId}`, "GET");

        let students, teachers, waitingroomStudents, waitingroomTeachers;

        if (role === "teacher") {
            [students, teachers, waitingroomStudents, waitingroomTeachers] = await Promise.all([
                apiRequest(`/classes/${classId}/students`, "GET"),
                apiRequest(`/classes/${classId}/teachers`, "GET"),
                apiRequest(`/classes/${classId}/waitingroom/students`, "GET"),
                apiRequest(`/classes/${classId}/waitingroom/teachers`, "GET")
            ]);
        } else {
            [students, teachers] = await Promise.all([
                apiRequest(`/classes/${classId}/students`, "GET"),
                apiRequest(`/classes/${classId}/teachers`, "GET")
            ]);
        }

        const acceptedTeachers = await fetchUsers("teachers", teachers.teachers, "teacher");
        const acceptedStudents = await fetchUsers("students", students.students, "student");

        acceptedMembers = [...acceptedTeachers, ...acceptedStudents];
        allAcceptedMembers = [...acceptedMembers];

        if (role === "teacher") {
            const pendingTeachers = await fetchUsers("teachers", waitingroomTeachers.teachers, "teacher");
            const pendingStudents = await fetchUsers("students", waitingroomStudents.students, "student");

            pendingRequests = [...pendingTeachers, ...pendingStudents];
            allPending = [...pendingRequests];
        }


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
                name: classData ? classData.name : "Name unknown",
                conversations: conversations
            };
        }

    });

    function filterByRole(list: Member[], role: string): Member[] {
        if (role === "teacher" || role === "student") {
            return list.filter(member => member.role === role);
        }
        return [...list];
    }

    function toggleAcceptedRole(role: string) {
        acceptedMembers = filterByRole(allAcceptedMembers, role);
    }

    function togglePendingRole(role: string) {
        pendingRequests = filterByRole(allPending, role);
    }

    async function acceptRequest(id: string, username: string, role: string) {
    
        await apiRequest(`/classes/${classId}/waitingroom/${role}s/${id}`, 'PATCH');

        pendingRequests = pendingRequests.filter(request => request.id !== id || request.role !== role);
        acceptedMembers = [...acceptedMembers, { id, username, role }];
    }

    async function deleteMemberOrRequest(id: string, role: string, type: string) {
        if(type === "member") {
            await apiRequest(`/classes/${classId}/${role}s/${id}`, 'DELETE');
            acceptedMembers = acceptedMembers.filter(request => (request.id !== id || request.role !== role));
            allAcceptedMembers = [...acceptedMembers];
        } else {
            await apiRequest(`/classes/${classId}/waitingroom/${role}s/${id}`, 'DELETE');
            pendingRequests = pendingRequests.filter(request => (request.id !== id || request.role !== role));
            allPending = [...pendingRequests];
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

    function goToConversation(conversation: Conversation) {
        conversationStore.set(conversation);
        routeTo(`/conversations/${conversation.link.split("/")[8]}`);
    }

</script>

<main>
    <Header/>

    <div class="content-container">
        <!-- Sidebar Navigation -->
        <Drawer navigation_items={navigation_items} navigation_paths={[`classrooms/${classId}`, `classrooms/${classId}/assignments`]} active={active}/>

        <!-- Main Content -->
        <div class="main-content">
            <!-- Back Button -->
            <button class="back-button" on:click={() => routeToItem('classrooms')}>&larr; {$currentTranslations.classroom.back}</button>
            

            <!-- Class Header with Join Code on the Right -->
            <div class="class-header">
                <h1>{#if classData}{$currentTranslations.classroom.classroom}: {classData.name}{:else}{$currentTranslations.classroom.loading}...{/if}</h1>
                {#if role === "teacher"}
                    <div class="join-code">
                        <p>{$currentTranslations.classroom.join}:</p>
                        <span class="code-box">{joinLink}</span>
                        <button class="copy-button" on:click={copyToClipboard}>
                            {copied ? "✅" : "📋"}
                        </button>
                    </div>
                {/if}
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
                                                <button class="icon-button reject" on:click={() => deleteMemberOrRequest(member.id, member.role, "member")} aria-label="Reject request">
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
                {#if role === "teacher" && allPending.length > 0}
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
                                            <button class="icon-button reject" on:click={() => deleteMemberOrRequest(request.id, request.role, "request")} aria-label="Reject request">
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
        margin-top: 10px;
    }

    .tables-container {
        display: flex;
        gap: 20px;
        overflow-x: auto;
    }

    .table-section {
        flex: 1;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        overflow-x: auto;
        max-height: 800px;
        overflow-y: auto;
        flex: 1;
		border: 10px solid var(--dwengo-green);
		padding-left: 15px;
		padding-right: 15px;
		padding-top: 10px;
		padding-bottom: 10px;
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

    .copy-button {
		background-color: var(--dwengo-green);
		color: white;
		border: none;
		padding: 8px 12px;
		border-radius: 5px;
		cursor: pointer;
		transition: background-color 0.2s;
	}

    .copy-button:hover {
		background-color: white;
	}

</style>
