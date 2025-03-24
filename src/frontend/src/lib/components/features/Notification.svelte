<script lang="ts">
    //TODO: Fetch the real data (talk to Thor)
    let dummy_data = [
        {
            id: 1,
            title: "Notification 1",
            description: "Description 1"
        },
        {
            id: 2,
            title: "Notification 2",
            description: "Description 2"
        },
        {
            id: 3,
            title: "Notification 3",
            description: "Description 3"
        }
    ];
    let showNotifications = false;
</script>

<div class="notification-center">
    <div class="notification-icon">
        <button class="bell" on:click={showNotifications=!showNotifications}></button> <!--show the notifications-->
        <p class="amount">{dummy_data.length}</p> <!--Amount of notifications-->
    </div>
    {#if showNotifications}
        <div class="notification-list">
            {#each dummy_data as notification}
                <div class="notification">
                    <h3>{notification.title}</h3>
                    <p>{notification.description}</p>
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    .notification-center {
        display: flex;
        align-items: center;
    }

    .notification-icon {
        position: relative; /* Enables absolute positioning for children */
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
        top: -5px;  /* Adjust to move upwards */
        right: -5px; /* Adjust to move right */
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
</style>
