<script lang="ts">
    import { onMount } from "svelte";
    import Header from "../../../lib/components/layout/Header.svelte";
    import Drawer from "../../../lib/components/features/Drawer.svelte";
    import { user } from "../../../lib/stores/user.ts";
    import { routeTo } from "../../../lib/route.ts";
    import { apiRequest } from "../../../lib/api";
    import { currentTranslations } from "../../../lib/locales/i18n";
    import { conversationStore } from "../../../lib/stores/conversation.ts";
    import type { ClassData, ClassUrl, Conversation, MessageData, SenderData } from "../../../lib/types/types.ts";

    let id: string | null = null;
    const role = $user.role;

    const navigation_items = ["classrooms", "questions", "assignments"];
    const navigation_paths = ["classrooms", "questions", "assignments"];

    let classrooms: (ClassData & { conversations: Conversation[] })[] = [];
    let editing: boolean = false;

    function toggleEdit() {
        editing = !editing;
    }

    function updateClassName(classroomIndex: string, event: any) {
        classrooms[classroomIndex].name = event.target.value;
    }

    async function deleteConversation(conversationId: string) {
        try {
            await apiRequest(`${conversationId}`, "DELETE");
            
            classrooms = classrooms.map((classroom: any) => ({
                ...classroom,
                conversations: classroom.conversations.filter((conversation: any) => conversation.link !== conversationId)
            }));

        } catch (err) {
            console.error("Failed to delete conversation:", err);
        }
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

        classrooms = await Promise.all(classUrls.map(async (classUrl: ClassUrl) => {            
            const classData = await apiRequest(`${classUrl}`, "GET"); // Get class details

            let conversations = [];

            if (role === "teacher") {
                const conversationResp = await apiRequest(`${classUrl}/conversations`, "GET");

                for (let i = 0; i < conversationResp.conversations.length; i++) {
                    const actualConversation = conversationResp.conversations[i];
                    const conversationData = await apiRequest(`${actualConversation}`, "GET");
                    const messagesData = await apiRequest(`${conversationData.links.messages}`, "GET");

                    const messageUrl = messagesData.messages[0]; // Find the first message's author
                    let message: MessageData | null = null;
                    if(messageUrl !== undefined) message = await apiRequest(`${messageUrl}`, "GET");

                    let sender: SenderData | null = null;
                    if(message !== null) sender = await apiRequest(`${message.sender}`, "GET");

                    const assignment = await apiRequest(`${actualConversation.match(/^\/classes\/\d+\/assignments\/\d+/)[0]}`, "GET");

                    conversations.push({
                        link: actualConversation,
                        title: conversationData.title,
                        assignment: assignment.name || "N/A",
                        update: conversationData.update || "Unknown",
                        author: sender === null ? "Unknown" : sender.name,
                        group: conversationData.group
                    });
                }
            } else if (role === "student") {
                const assignments = await apiRequest(`/students/${id}${classUrl}/assignments`, "GET");
                for(let i = 0; i < assignments.assignments.length; i++) {
                    const assignment = await apiRequest(`${assignments.assignments[i]}`, "GET");
                    //This doesn't exist yet in the API
                    //const groups = await apiRequest(`/students/${id}${classUrl}/groups`, "GET");
                }
            }

            return {
                name: classData.name,
                conversations: conversations
            };
        }));
    });

    function goToConversation(conversation: Conversation) {
        conversationStore.set(conversation);
        routeTo(`/conversations/${conversation.link.split("/")[8]}`);
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
                    <h1>All your questions</h1>
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
                        <p>You haven't asked any questions yet in this class.</p>
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