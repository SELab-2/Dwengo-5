<script lang="ts">
    import { onMount, onDestroy, tick } from "svelte";

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

    onMount(() => {
        document.addEventListener("click", handleClickOutside);
    });

    onDestroy(() => {
        document.removeEventListener("click", handleClickOutside);
    });

    // Dummy notifications
    let dummyQuestions = [
        { id: 1, title: "Question 1", description: "Description 1" },
        { id: 2, title: "Question 2", description: "Description 2" },
        { id: 3, title: "Question 3", description: "Description 3" }
    ];
    
    let dummyInvites = [
        { id: 4, title: "Invite 1", description: "Description 4" },
        { id: 5, title: "Invite 2", description: "Description 5" },
        { id: 6, title: "Invite 3", description: "Description 6" }
    ];
</script>

<div class="notification-center">
    <div class="notification-icon">
        <button class="bell" on:click={() => showNotifications = !showNotifications}></button> 
        <p class="amount">{ dummyQuestions.length + dummyInvites.length}</p>
    </div>

    {#if showNotifications}
        <div class="notification-list">
            <div class="toggle-profile">
                <input type="checkbox" id="toggle2" class="toggleCheckbox" bind:checked={isQuestion} />
                <label for="toggle2" class="toggleContainer">
                    <div>Vragen</div>  
                    <div>Invites</div>  
                </label>
            </div>
            
            {#each (isQuestion ? dummyQuestions : dummyInvites) as notification}
                <div class="notification">
                    <h3>{notification.title}</h3>
                    <p>{notification.description}</p>
                </div>
            {/each}
        </div>
    {/if}
</div>

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
