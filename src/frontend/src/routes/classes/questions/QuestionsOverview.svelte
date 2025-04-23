<script lang="ts">
    import { onMount } from "svelte";
    import Header from "../../../lib/components/layout/Header.svelte";
    import Drawer from "../../../lib/components/features/Drawer.svelte";
    import { user } from "../../../lib/stores/user.ts";
    import { routeTo } from "../../../lib/route.ts";
    import { apiRequest } from "../../../lib/api";
    import { currentTranslations } from "../../../lib/locales/i18n";
    import { conversationStore } from "../../../lib/stores/conversation.ts";

    let id: string | null = null;
    const role = $user.role;
    let conversations = [];

    let navigation_items = $user.role === "teacher" ? ["dashboard"] : [];
    let navigation_paths = $user.role === "teacher" ? ["dashboard"] : [];

    navigation_items = [...navigation_items, "classrooms", "questions", "assignments", "catalog"];
    navigation_paths = [...navigation_paths, "classrooms", "questions", "assignments", "catalog"];

    let classrooms : any = null;
    let editing: boolean = false;

    function toggleEdit() {
        editing = !editing;
    }

    function updateClassName(classroomIndex: string, event: any) {
        classrooms[classroomIndex].name = event.target.value;
    }

    onMount(async () => {
        const hash = window.location.hash;
        const queryString = hash.split('?')[1];
        if (queryString) {
            const urlParams = new URLSearchParams(queryString);
            id = urlParams.get('id');
        }

        const response = await apiRequest(`/${role}s/${id}/classes`, "GET");
        let classUrls = response.classes;

        // Teacher side - Using Promise.all to fetch data concurrently
        classrooms = await Promise.all(classUrls.map(async (classUrl: any) => {            
            const classData = await apiRequest(`${classUrl}`, "GET"); // Get class details

            let conversations: any[] = [];
            if (role === "teacher") { // Only fetch conversations if user is a teacher
                const conversationResp = await apiRequest(`${classUrl}/conversations`, "GET");

                conversations = await Promise.all(conversationResp.conversations.map(async (actualConversation: any) => {
                    const conversationData = await apiRequest(`${actualConversation}`, "GET");
                    const messagesData = await apiRequest(`${conversationData.links.messages}`, "GET");

                    const messageUrl = messagesData.messages[0]; // Find the first message's author
                    let message: any = null;
                    if (messageUrl !== undefined) message = await apiRequest(`${messageUrl}`, "GET");

                    let sender: any = null;
                    if (message !== null) sender = await apiRequest(`${message.sender}`, "GET");

                    const assignment = await apiRequest(`${actualConversation.match(/^\/classes\/\d+\/assignments\/\d+/)[0]}`, "GET");

                    return {
                        link: actualConversation,
                        title: conversationData.title,
                        assignment: assignment.name || "N/A",
                        update: conversationData.update || "Unknown",
                        author: sender === null ? "Unknown" : sender.name,
                        group: conversationData.group
                    };
                }));
            }

            return {
                name: classData.name,
                conversations: conversations
            };
        }));

        if (role === "student") {
            const studentResponse = await apiRequest(`/${role}s/${id}/classes`, "GET");
            let studentClassUrls = studentResponse.classes;

            classrooms = await Promise.all(studentClassUrls.map(async (classUrl: any) => {
                const classroom = await apiRequest(`${classUrl}`, "GET")
                const assignments = await apiRequest(`${classUrl}/assignments`, "GET");
                let conversations: any[] = [];

                await Promise.all(assignments.assignments.map(async (assignmentUrl: string) => {
                    try {
                        const assignment = await apiRequest(`${assignmentUrl}`, "GET");

                        if (assignment.status === "403") {
                            return;
                        }

                        const groups = await apiRequest(`${assignmentUrl}/groups`, "GET");

                        await Promise.all(groups.groups.map(async (groupUrl: string) => {
                            const group = await apiRequest(`${groupUrl}/conversations`, "GET");

                            await Promise.all(group.conversations.map(async (conversationUrl: string) => {
                                try {
                                    const conversationData = await apiRequest(`${conversationUrl}`, "GET");
                                    console.log(conversationData);
                                    const messages = await apiRequest(`${conversationData.links.messages}`, "GET");
                                    const firstMessage = await apiRequest(`${messages.messages[0]}`, "GET");
                                    if(firstMessage.sender === `/students/${id}`) {
                                        const sender = await apiRequest(`${firstMessage.sender}`, "GET");
                                    
                                        conversations.push({
                                            link: conversationUrl,
                                            title: conversationData.title,
                                            assignment: assignment.name || "N/A",
                                            update: conversationData.update || "Unknown",
                                            author: sender.name || "Unknown",
                                            group: conversationData.group
                                        });
                                    }
                                } catch {
                                    // Silence any errors without logging anything
                                }
                            }));
                        }));
                    } catch {
                        // Silently skip the assignment if it cannot be fetched (403 or other errors)
                    }
                }));

                return {
                    name: classroom.name,
                    conversations: conversations
                };
            }));
        }


    });

    function goToConversation(conversation: any) {
        conversationStore.set(conversation);
        routeTo(`/conversations/${conversation.link.split("/")[8]}`);
    }

    async function deleteConversation(conversationId: string) {
        try {
            //Delete conversation from database
            await apiRequest(`${conversationId}`, "DELETE");
            
            //Delete conversation from list locally
            classrooms = classrooms.map(classroom => ({
                ...classroom,
                conversations: classroom.conversations.filter((conversation: any) => conversation.link !== conversationId)
            }));

        } catch (err) {
            console.error("Failed to delete conversation:", err);
        }
    }
</script>

<main>
    <Header/>
    <div class="content-container">
        <!-- Sidebar Navigation -->
        <Drawer navigation_items={navigation_items} navigation_paths={navigation_paths} active="questions"/>

        <div class="main-content">
                {#if role === "teacher"}
                    <h1>{$currentTranslations.questions.overview}</h1>
                    <button class="edit-btn" on:click={() => toggleEdit()}>
                        {editing === true ? "Done" : "Edit"}
                    </button>
                {:else}
                    <h1>Overview of all your questions</h1>
                {/if}
                {#each classrooms as classroom}
                    <section class="table-section">
                    <div class="classroom-header">
                        <h2>{classroom.name}</h2>
                    </div>
            
                    {#if classroom.conversations.length > 0}
                        <table>
                            <thead>
                                <tr>
                                    <th>{$currentTranslations.questions.topic}</th>
                                    <th>{$currentTranslations.questions.assignment}</th>
                                    <th>{$currentTranslations.questions.update}</th>
                                    <th>{$currentTranslations.questions.author}</th>
                                    {#if editing === true}
                                        <th>Delete</th>
                                    {/if}
                                </tr>
                            </thead>
                            <tbody>
                                {#each classroom.conversations as conversation}
                                <tr>
                                    <td on:click={() => goToConversation(conversation)}>{conversation.title}</td>
                                    <td>{conversation.assignment}</td>
                                    <td>{conversation.update}</td>
                                    <td>{conversation.author}</td>
                                    {#if editing === true}
                                        <td>
                                            <button
                                                class="delete-btn"
                                                on:click={() => deleteConversation(conversation.link)}
                                                >
                                                🗑️
                                            </button>
                                        </td>
                                    {/if}
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                {:else}
                    {#if role === "teacher"}
                        <p>{$currentTranslations.questions.notPosted}</p>
                    {:else}
                        <p>You haven't started asked a question for this assignment.</p>
                    {/if}
                {/if}
                </section>
            {/each}
            {#if classrooms === null}
                <h4>{$currentTranslations.questions.notFound}</h4>
            {/if}
        </div>
    </div>
</main>

<style>
    h1 {
        display: flex;
        justify-content: space-between;
        align-items: center;
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

    .table-section {
        flex: 1;
        background: white;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin-bottom: 20px;
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

    .classroom-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .edit-btn {
        padding: 4px 10px;
        font-size: 0.9rem;
        background-color: #e0f7e9;
        border: 1px solid #4caf50;
        color: #2e7d32;
        border-radius: 6px;
        cursor: pointer;
    }

    .delete-btn {
        background-color: transparent;
        border: none;
        color: #e53935;
        font-size: 1.2rem;
        cursor: pointer;
    }

</style>