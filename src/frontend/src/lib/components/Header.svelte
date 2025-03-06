<script>
    import { createEventDispatcher } from "svelte";

    let items = ["Home", "Dashboard", "Catalog", "Classrooms", "Courses", "Create new course", "Over ons team"];
    export let activeItem = "Home";
    const dispatch = createEventDispatcher();
</script>

<header>
    <h1>
        <img src="/img/dwengo-groen-zwart.svg" alt="Dwengo Logo">
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