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

    let navigation_items = $user.role === "teacher" ? ["dashboard", "questions"] : [];
    let navigation_paths = $user.role === "teacher" ? ["dashboard", "questions"] : [];

    navigation_items = [...navigation_items, "classrooms", "assignments", "catalog"];
    navigation_paths = [...navigation_paths, "classrooms", "assignments", "catalog"];

    let classrooms : any = null;

    onMount(async () => {
        const hash = window.location.hash;
        const queryString = hash.split('?')[1];
        if (queryString) {
            const urlParams = new URLSearchParams(queryString);
            id = urlParams.get('id');
        }

        const response = await apiRequest(`/${role}s/${id}/classes`, "GET");
        let classUrls = response.classes;

        classrooms = await Promise.all(classUrls.map(async (classUrl: any) => {            
            const classData = await apiRequest(`${classUrl}`, "GET"); // Get class details

            let conversations = [];

            if (role === "teacher") { // Only fetch conversations if user is a teacher
                const conversationResp = await apiRequest(`${classUrl}/conversations`, "GET");

                for (let i = 0; i < conversationResp.conversations.length; i++) {
                    const actualConversation = conversationResp.conversations[i];
                    const conversationData = await apiRequest(`${actualConversation}`, "GET");
                    const messagesData = await apiRequest(`${conversationData.links.messages}`, "GET");

                    const messageUrl = messagesData.messages[0]; // Find the first message's author
                    let message: any = null;
                    if(messageUrl !== undefined) message = await apiRequest(`${messageUrl}`, "GET");

                    let sender : any = null;
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
            }

            return {
                name: classData.name,
                conversations: conversations
            };
        }));
    });

    function goToConversation(conversation: any) {
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
                {#each classrooms as classroom}
                    <section class="table-section">
                        <h2>{classroom.name}</h2>
                        {#if classroom.conversations.length > 0}
                            <table>
                                <thead>
                                    <tr>
                                        <th>{$currentTranslations.questions.topic}</th>
                                        <th>{$currentTranslations.questions.assignment}</th>
                                        <th>{$currentTranslations.questions.update}</th>
                                        <th>{$currentTranslations.questions.author}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {#each classroom.conversations as conversation}
                                        <tr onclick={() => goToConversation(conversation)}>
                                            <td>{conversation.title}</td>
                                            <td>{conversation.assignment}</td>
                                            <td>{conversation.update}</td>
                                            <td>{conversation.author}</td>
                                        </tr>
                                    {/each}
                                </tbody>
                            </table>
                        {:else}
                            <p>{$currentTranslations.questions.notPosted}</p>
                        {/if}
                    </section>
                {/each}
                {#if classrooms === null}
                    <h4>{$currentTranslations.questions.notFound}</h4>
                {/if}
            {:else}
                <h1>Only teachers have access to this page.</h1>
            {/if}
        </div>
    </div>
</main>

<style>
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

</style>