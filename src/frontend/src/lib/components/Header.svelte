<script>
    import Tab from "$lib/shared/Tab.svelte";
    import { createEventDispatcher } from "svelte";

    let items = ["Home", "Catalog", "Classrooms", "Assignments"];
    export let activeItem = "Home";
    const dispatch = createEventDispatcher();

    const tabChange = (e) => {
        activeItem = e.detail;
        dispatch("updateActiveItem", activeItem);
    };
</script>

<header>
    <h1>
        <img src="/images/dwengo-groen-zwart.svg" alt="Dwengo Logo">
        <Tab activeItem items={items} on:tabChange={tabChange} />
        <!---todo hier moet nog een language selecter zoals dodona --->

        <img src="/images/blank_avatar.png" alt="Avatar" class="profile_pic">
        <div>
            <p>Pedro</p>
            <p style="font-size: medium;">Teacher</p>
        </div>
        <!---todo hier moet nog een vergrootglas en notifactiebel --->
    </h1>
    
</header>

<style>
 
    h1 {
        text-align: left;
        list-style-type: none;
        display: flex;
    }
    img {
        display: block;
        max-width:230px;
        max-height:95px;
        width: auto;
        height: auto;
    }
    .profile_pic {
        margin-left: auto;
        border-radius: 50%;
        width: 80px;
        height: 80px;
        background-image: "";
    }
</style>