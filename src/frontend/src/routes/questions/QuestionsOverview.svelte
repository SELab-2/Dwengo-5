<script lang="ts">
    import { onMount } from "svelte";
    import Header from "../../lib/components/layout/Header.svelte";
    import { user } from "../../lib/stores/user.ts";
    import { routeTo } from "../../lib/route.ts";
    import { apiRequest } from "../../lib/api";
    import { currentTranslations } from "../../lib/locales/i18n";
    // import { conversationStore } from "../../lib/stores/conversation.ts";
    import type {ClassData, ClassUrl,Conversation,MessageData, SenderData,} from "../../lib/types/types.ts";

    let id: string | null = null;
    const role = $user.role;

    let classrooms: (ClassData & { conversations: Conversation[] })[] = [];
    let editing: boolean = false;
    let searchQuery: string = "";

    function toggleEdit() {
        editing = !editing;
    }

    async function deleteConversation(conversationId: string) {
        try {
            await apiRequest(`${conversationId}`, "DELETE");

            classrooms = classrooms.map((classroom: any) => ({
                ...classroom,
                conversations: classroom.conversations.filter(
                    (conversation: any) => conversation.link !== conversationId
                ),
            }));
        } catch (err) {
            console.error("Failed to delete conversation:", err);
        }
    }

    onMount(async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get("id") || "";

        const response = await apiRequest(`/users/${id}/classes`, "GET");
        const classUrls = response.classes;

        classrooms = await Promise.all(
            classUrls.map(async (classUrl: ClassUrl) => {
                const classData = await apiRequest(`${classUrl}`, "GET");

                // Function to fetch conversations based on role
                const fetchConversations = async (
                    role: string,
                    classUrl: string
                ) => {
                    const conversations = [];
                    let conversationResp;

                    if (role === "teacher") {
                        conversationResp = await apiRequest(
                            `${classUrl}/conversations`,
                            "GET"
                        );
                    } else if (role === "student") {
                        conversationResp = await apiRequest(
                            `${classUrl}/students/${id}/conversations`,
                            "GET"
                        );
                    }

                    for (const actualConversation of conversationResp.conversations) {
                        const conversationData = await apiRequest(
                            `${actualConversation}`,
                            "GET"
                        );
                        const assignment = await apiRequest(
                            `${actualConversation.match(/^\/classes\/\d+\/assignments\/\d+/)[0]}`,
                            "GET"
                        );
                        const messagesData = await apiRequest(
                            `${conversationData.links.messages}`,
                            "GET"
                        );

                        const firstMessageUrl = messagesData.messages[0];
                        const firstMessage = firstMessageUrl
                            ? await apiRequest(`${firstMessageUrl}`, "GET")
                            : null;
                        const sender = firstMessage
                            ? await apiRequest(`${firstMessage.sender}`, "GET")
                            : null;

                        const lastMessageUrl =
                            messagesData.messages[
                                messagesData.messages.length - 1
                            ];
                        const lastMessage = lastMessageUrl
                            ? await apiRequest(`${lastMessageUrl}`, "GET")
                            : null;

                        conversations.push({
                            link: actualConversation,
                            title: conversationData.title,
                            assignment: assignment.name || "N/A",
                            update: lastMessage
                                ? new Date(
                                      lastMessage.postTime
                                  ).toLocaleString()
                                : "Unknown",
                            author: sender ? sender.name : "Unknown",
                            group: conversationData.group,
                        });
                    }

                    return conversations;
                };

                const conversations = await fetchConversations(role, classUrl);

                return {
                    name: classData.name,
                    conversations: conversations,
                };
            })
        );
    });

    function goToConversation(conversation: Conversation) {
        routeTo(`${conversation.link.replace("classes", "classrooms")}`);
    }

    // Filter classrooms based on searchQuery
    $: filteredClassrooms = classrooms.filter((classroom) =>
        classroom.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
</script>

<main>
    <Header />
    {#if role === "teacher"}
        <div class="title-container">
            <p class="title">{$currentTranslations.questions.overview}</p>
        </div>
    {:else}
        <div class="title-container">
            <p class="title">{$currentTranslations.questions.all}</p>
        </div>
    {/if}

    <div class="content-container">
        <div class="main-content">
            <div class="controls-container">
                <div class="search-container">
                    <input
                        type="text"
                        placeholder={$currentTranslations.questions.search}
                        bind:value={searchQuery}
                        class="search-input"
                    />
                </div>
                {#if role === "teacher"}
                    <button class="edit-btn" on:click={() => toggleEdit()}>
                        {editing === true
                            ? $currentTranslations.questions.done
                            : $currentTranslations.questions.edit}
                    </button>
                {/if}
            </div>

            {#each filteredClassrooms as classroom}
                <section class="table-section">
                    <div class="classroom-header">
                        <h2>{classroom.name}</h2>
                    </div>

                    {#if classroom.conversations.length > 0}
                        <table>
                            <thead>
                                <tr>
                                    <th
                                        >{$currentTranslations.questions
                                            .topic}</th
                                    >
                                    <th
                                        >{$currentTranslations.questions
                                            .assignment}</th
                                    >
                                    <th
                                        >{$currentTranslations.questions
                                            .update}</th
                                    >
                                    <th
                                        >{$currentTranslations.questions
                                            .author}</th
                                    >
                                    {#if editing === true}
                                        <th></th>
                                    {/if}
                                </tr>
                            </thead>
                            <tbody>
                                {#each classroom.conversations as conversation}
                                    <tr
                                        style="cursor: pointer;"
                                        on:click={() =>
                                            goToConversation(conversation)}
                                    >
                                        <td>{conversation.title}</td>
                                        <td>{conversation.assignment}</td>
                                        <td>{conversation.update}</td>
                                        <td>{conversation.author}</td>
                                        {#if editing === true}
                                            <td>
                                                <button
                                                    class="icon-button reject"
                                                    on:click={() =>
                                                        deleteConversation(
                                                            conversation.link
                                                        )}
                                                    aria-label="Reject request"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="15"
                                                        height="15"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="red"
                                                        stroke-width="2"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                    >
                                                        <path
                                                            d="M18 6 6 18M6 6l12 12"
                                                        />
                                                    </svg>
                                                </button>
                                            </td>
                                        {/if}
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    {:else if role === "teacher"}
                        <p>{$currentTranslations.questions.none}</p>
                    {:else}
                        <p>{$currentTranslations.questions.noPost}</p>
                    {/if}
                </section>
            {/each}
            {#if filteredClassrooms.length === 0}
                <p>{$currentTranslations.classrooms.notFound}</p>
            {/if}
        </div>
    </div>
</main>

<style>
    .controls-container {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 15px;
        margin-bottom: 20px;
    }

    .search-container {
        display: flex;
        align-items: center;
    }

    .search-input {
        padding: 6px 12px;
        font-size: 0.9rem;
        border-radius: 4px;
        border: 1px solid #ccc;
        width: 150px;
        height: 35px;
    }

    .title-container {
        flex: 0;
        padding-left: 20px;
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
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }

    .table-section {
        flex: 1;
        background: white;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin-bottom: 20px;
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

    th,
    td {
        padding: 10px;
        text-align: left;
        border-bottom: 1px solid #ddd;
    }

    th {
        background-color: var(--dwengo-green);
        color: white;
    }

    .classroom-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }

    .classroom-header h2 {
        margin: 0;
    }

    .edit-btn {
        align-items: center;
        padding: 4px 10px;
        font-size: 0.9rem;
        background-color: #e0f7e9;
        border: 1px solid #4caf50;
        color: #2e7d32;
        border-radius: 6px;
        cursor: pointer;
        width: 150px;
        height: 50px;
    }

    .reject {
        background-color: transparent;
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        cursor: pointer;
        border: white;
    }
</style>
