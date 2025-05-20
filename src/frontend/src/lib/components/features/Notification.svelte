<script lang="ts">
    import { onMount, onDestroy, tick } from "svelte";
    import { currentTranslations } from "../../locales/i18n";
    import { apiRequest } from "../../api";
    import { routeTo } from "../../route.ts";

    let showNotifications = false;

    function handleClickOutside(event: MouseEvent) {
        const element = document.querySelector(".notification-list");
        const bell = document.querySelector(".bell");
        if (
            element &&
            !element.contains(event.target as Node) &&
            bell &&
            !bell.contains(event.target as Node)
        ) {
            showNotifications = false;
            tick();
        }
    }

    async function fetchAllNotifications(userID: string) {
        try {
            const response = await apiRequest(
                `/users/${userID}/notifications`,
                "GET"
            );
            const notificationLinks = response.notifications;
            const notifications = [];
            for (const link of notificationLinks) {
                const notif = await apiRequest(link, "GET");
                notifications.push({
                    id: parseInt(link.split("/").pop()),
                    type: notif.type,
                    read: notif.read,
                });
            }

            console.log("Fetched notifications:", notifications);

            // Sort notifications based on type
            questions = notifications.filter(
                (n) => n.type === "QUESTION" && !n.read
            );
            invites = notifications.filter(
                (n) => n.type === "INVITE" && !n.read
            );
        } catch (error) {
            errorMsg = "Failed to fetch notifications.";
            console.log(error);
        }
    }

    async function onQuestionClick() {
        routeTo("/questions");

        // Mark all questions as read
        await Promise.all(
            questions.map((question) => {
                if (!question.read) {
                    return apiRequest(
                        `/users/${userID}/notifications/${question.id}`,
                        "PATCH"
                    );
                }
            })
        );
        if (userID) {
            await fetchAllNotifications(userID);
        }
    }

    async function onInviteClick() {
        // Mark all invites as read
        await Promise.all(
            invites.map((invite) => {
                if (!invite.read) {
                    return apiRequest(
                        `/users/${userID}/notifications/${invite.id}`,
                        "PATCH"
                    );
                }
            })
        );
        if (userID) {
            await fetchAllNotifications(userID);
        }
    }

    let userID: string | null = null;
    let loading = true;
    let errorMsg: string | null = null;

    let questions: { id: number; type: string; read: boolean }[] = [];
    let invites: { id: number; type: string; read: boolean }[] = [];

    onMount(() => {
        document.addEventListener("click", handleClickOutside);
        const queryString = window.location.search;
        if (queryString) {
            const urlParams = new URLSearchParams(queryString);
            userID = urlParams.get("id");

            if (userID) {
                fetchAllNotifications(userID).finally(() => (loading = false));
            } else {
                loading = false;
            }
        } else {
            errorMsg = "Invalid URL parameters!";
            loading = false;
        }
    });

    onDestroy(() => {
        document.removeEventListener("click", handleClickOutside);
    });
</script>

{#if loading}
    <div class="notification-center">
        <div class="notification-icon">
            <button class="bell" aria-label="Toggle notifications"> </button>

            <p class="amount">?</p>
        </div>
    </div>
{:else if errorMsg}
    <p class="error">{errorMsg}</p>
{:else}
    <div class="notification-center">
        <div class="notification-icon">
            <button
                class="bell"
                on:click={() => (showNotifications = !showNotifications)}
                aria-label="Toggle notifications"
            >
            </button>

            <p class="amount">{questions.length + invites.length}</p>
        </div>

        {#if showNotifications}
            <div class="notification-list">
                <button class="notif-item" on:click={onQuestionClick}>
                    {$currentTranslations.notifications.questions}
                    <span class="notif-count">{questions.length}</span>
                </button>
                <button class="notif-item" on:click={onInviteClick}>
                    {$currentTranslations.notifications.invites}
                    <span class="notif-count">{invites.length}</span>
                </button>
            </div>
        {/if}
    </div>
{/if}

<style>
    .notification-list {
        position: absolute;
        top: 70px;
        background-color: white;
        border: 5px solid var(--dwengo-green);
        border-radius: 8px;
        padding: 10px;
        z-index: 1;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .notification-center {
        display: flex;
        align-items: center;
    }
    .notification-icon {
        position: relative;
        display: inline-block;
    }
    .bell {
        background-image: url("/images/notification_bell.png");
        background-color: transparent;
        background-size: cover;
        width: 30px;
        height: 30px;
        border: none;
        cursor: pointer;
    }
    .amount {
        position: absolute;
        top: -5px;
        right: -5px;
        background-color: #ff0000;
        color: white;
        border-radius: 50%;
        width: 18px;
        height: 18px;
        text-align: center;
        font-size: 12px;
        line-height: 18px;
        font-weight: bold;
    }

    .notif-item {
        background: none;
        border: none;
    }

    .notif-count {
        margin-left: 8px;
        background: #eee;
        color: #222;
        border-radius: 10px;
        padding: 2px 8px;
        font-size: 12px;
        font-weight: bold;
    }
</style>
