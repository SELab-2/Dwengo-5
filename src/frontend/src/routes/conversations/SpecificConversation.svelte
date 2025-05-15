<script lang="ts">
    import { onMount } from "svelte";
    import Header from "../../../lib/components/layout/Header.svelte";
    import { apiRequest } from "../../../lib/api";
    // import { conversationStore } from "../../../lib/stores/conversation.ts";
    import { user } from "../../../lib/stores/user.ts";
    import { currentTranslations } from "../../../lib/locales/i18n";
    import { routeTo } from "../../../lib/route.ts";
    import type { Conversation, MessageData } from "../../../lib/types/types.ts";

    let id: string | null = null;
    const role = $user.role;

    let conversationData: Conversation | null = null;
    let messages: MessageData[] = [];
    let newReply: string = "";
    let showReplyInput = false;
    let assignment: string = "";
    let dashboardLink: string = "";
    let assignmentLink: string = "";

    // conversationStore.subscribe((data) => {
    //     if (data) conversationData = data;
    // });

    onMount(async () => {
        const hash = window.location.hash;
        const queryString = hash.split('?')[1];

        if (queryString) {
            const urlParams = new URLSearchParams(queryString);
            id = urlParams.get('id');
        }

        if (!conversationData) return;
        const link = conversationData.link.replace("classes", "classrooms");
        dashboardLink = `${link.split('/').slice(0, -2).join('/')}/dashboard`;        
        const response = await apiRequest(`${conversationData.link}`, "GET");
        let assignmentFetch = null;

        if (conversationData && conversationData.link) {
            const matchResult = conversationData.link.match(/^\/classes\/\d+\/assignments\/\d+/);
            if (matchResult) {
                assignmentFetch = await apiRequest(matchResult[0], "GET");
            }
        }
        assignment = assignmentFetch.name;
        const messageLinks = await apiRequest(`${response.links.messages}`, "GET");

        messages = await Promise.all(
            messageLinks.messages.map(async (messageUrl: string) => {
                const actualMessage = await apiRequest(messageUrl, "GET");

                const senderNameResponse = await apiRequest(`${actualMessage.sender}`, "GET");
                const senderName = senderNameResponse.name;

                return {
                    id: messageUrl.split('/').pop(),
                    content: actualMessage.content,
                    sender: senderName
                };
            })
        );
    });

    async function addReply() {
        if (!newReply.trim()) return;

        if(conversationData) {
            await apiRequest(`${conversationData.link}/messages`, "POST", {
                body: JSON.stringify({
                    sender: `/users/${id}`,
                    content: newReply
                })
            });
        }
        
        const user = await apiRequest(`/users/${id}`, "GET");

        messages = [...messages, { sender: `${user.name}`, content: newReply }];
        newReply = "";
        showReplyInput = false;
    }

</script>

<main>
    <Header />

    <div class="content">
        {#if conversationData}
            <section class="blog-post">
                <div class="assignment-header">
                    <h1>{$currentTranslations.conversation.assignment}:</h1>
                    <button class="assignment-link" on:click={() => routeTo(`${assignmentLink}`)}>
                        {assignment}
                    </button>
                </div>
                             
                <div class="assignment-header">
                    <h1 class="title">{$currentTranslations.conversation.title}:</h1>
                    <span class="title-text">{conversationData.title}</span>
                </div>
                {$currentTranslations.conversation.by} : 
                <button class="author" on:click={() => routeTo(`${dashboardLink}`)}>{conversationData.author}</button>

                {#if messages}
                    {#each messages as message, i}
                        {#if i === 0}
                            <div class="main-message">
                                <p>{message.content}</p>
                            </div>
                            <h2>{$currentTranslations.conversation.replies}</h2>
                        {:else}
                            <div class="reply">
                                <h4>{message.content}</h4>
                                <h5>{message.sender}</h5>
                            </div>
                        {/if}
                    {/each}
                {:else}
                    <p>{$currentTranslations.conversation.loading_m}</p>
                {/if}

                <div class="reply-section">
                    {#if messages.length === 1}
                        <p>{$currentTranslations.conversation.noReplies}</p>
                    {/if}
                    <button class="reply-button" on:click={() => showReplyInput = !showReplyInput}>
                        {showReplyInput ? `${$currentTranslations.conversation.cancel}` : `${$currentTranslations.conversation.add}`}
                    </button>

                    {#if showReplyInput}
                        <div class="reply-input">
                            <textarea bind:value={newReply} placeholder="Type your reply..."></textarea>
                            <button class="submit-reply" on:click={addReply}>{$currentTranslations.conversation.submit}</button>
                        </div>
                    {/if}
                </div>
            </section>
        {:else}
            <p>{$currentTranslations.conversation.loading_c}</p>
        {/if}
    </div>
</main>

<style>
    .content {
        display: flex;
        justify-content: center;
        padding: 20px;
    }

    .blog-post {
        background: white;
        padding: 20px;
        border-radius: 8px;
        max-width: 800px;
        width: 100%;
        flex: 1;
		border: 10px solid var(--dwengo-green);
		padding-left: 15px;
		padding-right: 15px;
		padding-top: 10px;
		padding-bottom: 10px;
    }

    .main-message p,
    .reply h4 {
        word-break: break-word;
        overflow-wrap: anywhere;
    }

    .title {
        font-size: 40px;
    }

    .author {
        background: none;
        border: none;
        padding: 0;
        margin: 0;
        font: inherit;
        color: inherit;
        cursor: pointer;
        text-align: left; /* optional */
        margin-bottom: 10px;
    }

    .author:hover {
        text-decoration: underline;
        color: #2c7a7b; /* optional: a subtle color change (e.g., teal) */
    }

    .main-message {
        background: #f9f9f9;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 20px;
        border-left: 4px solid #4CAF50;
    }

    h2 {
        margin-bottom: 10px;
        font-size: 20px;
        color: #333;
    }

    .reply {
        background: #f1f1f1;
        padding: 10px;
        border-radius: 6px;
        margin-bottom: 10px;
        border-left: 3px solid #ccc;
    }

    .reply-section {
        margin-top: 20px;
    }

    .reply-button {
        background: #4CAF50;
        color: white;
        border: none;
        padding: 10px;
        cursor: pointer;
        border-radius: 5px;
    }

    .reply-input {
        margin-top: 10px;
    }

    .reply-input textarea {
        width: 100%;
        height: 60px;
        padding: 10px;
        border-radius: 5px;
        border: 1px solid #ccc;
        resize: none;
    }

    .submit-reply {
        background: #2196F3;
        color: white;
        border: none;
        padding: 8px 12px;
        cursor: pointer;
        border-radius: 5px;
        margin-top: 5px;
    }

    .submit-reply:hover {
        background: #1976D2;
    }

    .assignment-header {
        display: flex;
        align-items: baseline;
        gap: 8px;
    }

    .title,
    .title-text {
        font-size: 1.5em;
        font-weight: 600;
        margin: 0;
        margin-bottom: 10px;
    }

    button.assignment-link {
        all: unset; /* remove default button styles */
        font-size: 1.5em; /* match h1 or adjust slightly smaller */
        color: #1b5e20;
        font-weight: 600;
        cursor: pointer;
    }

    button.assignment-link:hover {
        color: #145a32;
        text-decoration: none;
        text-decoration: underline;
    }

</style>
