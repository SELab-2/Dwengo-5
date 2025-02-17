<script>
    import Tab from "../shared/Tab.svelte";
    import { createEventDispatcher } from "svelte";

    let items = ["Home", "Dashboard", "Catalog", "Classrooms", "Courses", "Create new course", "Over ons team"];
    export let activeItem = "Home";
    const dispatch = createEventDispatcher();

    const tabChange = (e) => {
        activeItem = e.detail;
        dispatch("updateActiveItem", activeItem);
    };
</script>

<header>
    <h1>
        <img src="/img/dwengo-groen-zwart.svg" alt="Dwengo Logo">
        <Tab activeItem items={items} on:tabChange={tabChange} />
    </h1>
    
</header>

<style>
    header {
        background-color: #f7f7f7;
    }
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
</style>