<script lang="ts">
</script>

<div class="notification-center">
    <div class="notification-icon">
        <button class="bell"></button> <!--TODO show the notifications-->
        <p class="amount">3</p> <!-- TODO Amount of notifications -->
    </div>
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
