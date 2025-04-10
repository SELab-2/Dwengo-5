<script lang="ts">
    import { onMount } from "svelte";
    import Header from "../../../lib/components/layout/Header.svelte";
    import { apiRequest } from "../../../lib/api";
    import { conversationStore } from "../../../lib/stores/conversation.ts";
    import { user } from "../../../lib/stores/user.ts";
    import { currentTranslations } from "../../../lib/locales/i18n";

    let id: string | null = null;
    const role = $user.role;

    let conversationData: any = null;
    let messages: any = [];
    let newReply: string = "";
    let showReplyInput = false;
    let assignment: string = "";

    conversationStore.subscribe((data) => {
        if (data) conversationData = data;
    });

    onMount(async () => {
        const hash = window.location.hash;
        const queryString = hash.split('?')[1];

        if (queryString) {
            const urlParams = new URLSearchParams(queryString);
            id = urlParams.get('id');
        }

        if (!conversationData) return;

        const response = await apiRequest(`${conversationData.link}`, "GET");
        const assignmentFetch = await apiRequest(conversationData.link.match(/^\/classes\/\d+\/assignments\/\d+/)[0], "GET");
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
                    sender: senderName,
                };
            })
        );
    });

    async function addReply() {
        if (!newReply.trim()) return;

        const response = await apiRequest(`${conversationData.link}/messages`, "POST", {
            body: JSON.stringify({
                sender: `/${role}s/${id}`,
                content: newReply
            })
        });

        const user = await apiRequest(`/${role}s/${id}`, "GET");

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
                <h1>{$currentTranslations.conversation.assignment}: {assignment}</h1>
                <h1 class="title">{$currentTranslations.conversation.title}: {conversationData.title}</h1>
                <p class="author">{$currentTranslations.conversation.by}: {conversationData.author}</p>

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
                                <h6>{message.sender}</h6>
                            </div>
                        {/if}
                    {/each}
                {:else}
                    <p>{$currentTranslations.conversation.loading_m}</p>
                {/if}

                <div class="reply-section">
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
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .title {
        font-size: 20px;
        font-weight: bold;
    }

    .author {
        color: gray;
        font-size: 14px;
        margin-bottom: 20px;
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
</style>
