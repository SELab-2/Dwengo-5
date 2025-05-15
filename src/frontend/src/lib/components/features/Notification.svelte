<script lang="ts">
    import { onMount, onDestroy, tick } from "svelte";
    import { currentTranslations } from "../../locales/i18n";
    import { user } from "../../stores/user.ts";
    import { apiRequest } from "../../api";

    let showNotifications = false;
    let isQuestion = true; // Toggle state

    function handleClickOutside(event: MouseEvent) {
        const element = document.querySelector('.notification-list');
        const bell = document.querySelector('.bell');
        if (
            element && !element.contains(event.target as Node) &&
            bell && !bell.contains(event.target as Node)
        ) {
            showNotifications = false;
            tick(); 
        }
    }

    async function fetchAllNotifications(userID: string) {
        try {
            const response = await apiRequest(`/users/${userID}/notifications`, 'GET');
            const notificationLinks = response.notifications;
            const notifications = [];
            for (const link of notificationLinks) {
                const notif = await apiRequest(link, 'GET');
                notifications.push({
                    id: parseInt(link.split('/').pop()),
                    type: notif.type,
                    read: notif.read,
                });
            }

            console.log("Fetched notifications:", notifications);

            // Sort notifications based on type
            questions = notifications.filter(n => n.type === "QUESTION");
            invites = notifications.filter(n => n.type === "INVITE");
        } catch (error) {
            errorMsg = "Failed to fetch notifications.";
            console.log(error);
        }
    }

    let role: string | null = null;
    let userID: string | null = null;
    let loading = true;
    let errorMsg: string | null = null;

    let questions: { id: number, type: string, read: boolean }[] = [];
    let invites: { id: number, type: string, read: boolean }[] = [];

    onMount(() => {
        document.addEventListener("click", handleClickOutside);
        const hash = window.location.hash;
        const queryString = hash.split('?')[1];
        if (queryString) {
            const urlParams = new URLSearchParams(queryString);
            userID = urlParams.get('id');

            if (userID) {
                fetchAllNotifications(userID).finally(() => loading = false);
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
<p>Loading...</p>
{:else}
{#if errorMsg}
  <p class="error">{errorMsg}</p>
{:else}
<div class="notification-center">
    <div class="notification-icon">
        <button 
            class="bell" 
            on:click={() => showNotifications = !showNotifications}
            aria-label="Toggle notifications"
        >
        </button>

        <p class="amount">{ questions.length + invites.length }</p>
    </div>

    {#if showNotifications}
        <div class="notification-list">
            <div class="toggle-profile">
                <input type="checkbox" id="toggle2" class="toggleCheckbox" bind:checked={isQuestion} />
                <label for="toggle2" class="toggleContainer">
                    <div>{$currentTranslations.notifications.questions}</div>  
                    <div>{$currentTranslations.notifications.invites}</div>  
                </label>
            </div>
            
            {#each (isQuestion ? questions : invites) as notification}
                <div class="notification">
                    <h3>{notification.type}</h3>
                    <p>{notification.read}</p>
                </div>
            {/each}
        </div>
    {/if}
</div>
{/if}
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
        width: 200px;
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
        background-image: url("../../../../static/images/notification_bell.png");
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
        background-color: #FF0000;
        color: white;
        border-radius: 50%;
        width: 18px;
        height: 18px;
        text-align: center;
        font-size: 12px;
        line-height: 18px;
        font-weight: bold;
    }

    .toggle-profile {
        display: flex;
        justify-content: center;
        margin-bottom: 10px;
    }

    .toggleContainer {
        position: relative;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        width: fit-content;
        border: 4px solid var(--dwengo-green);
        border-radius: 25px;
        background: white;
        font-weight: bold;
        color: black;
        cursor: pointer;
        padding: 5px;
    }

    .toggleContainer::before {
        content: '';
        position: absolute;
        width: 50%;
        height: 100%;
        left: 50%;
        border-radius: 20px;
        background: var(--dwengo-green);
        transition: all 0.3s;
    }

    .toggleCheckbox:checked + .toggleContainer::before {
        left: 0%;
    }

    .toggleContainer div {
        padding: 6px;
        text-align: center;
        z-index: 1;
    }

    .toggleCheckbox {
        display: none;
    }
</style>
