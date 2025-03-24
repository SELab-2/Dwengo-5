<script lang="ts">
    //Drawer is used like this <Drawer navigation_items={["dashboard","questions","classrooms", "catalog"]} active="questions"/>
    export let navigation_items: string[] = []; 
    export let active: string;
    import { currentTranslations } from '../../locales/i18n'; // Import translations
    import { user } from '../../stores/user.ts';
    import { routeTo } from '../../route.ts';
</script>

<nav>
    <ul>
        {#each navigation_items as item}
            <div class="container" class:active={item === active}>
                <img src={"../../../../static/images/icons/" + item + ".png"} alt={item + " icon"}>
                <li>
                    <a class="link" on:click={() => routeTo(item)}>{$currentTranslations.drawer[item.toLowerCase()]}</a>
                </li>
            </div>            
        {/each}
    </ul>
</nav>

<style>
    .container {
        display: flex;
        align-items: center;
        width: 180px;
        gap: 10px;
        padding: 10px;
        border-radius: 5px;
        transition: background-color 0.3s ease;
    }

    li {
        font-family: 'C059-Italic'; 
        list-style-type: none;
    }

    .link {
        color: black; 
        text-decoration: none;
        font: inherit; 
        padding: none;
    }

    .container.active {
        background-color: var(--dwengo-green);
        position: relative;
    }

    .container.active::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 5px;  
        height: 100%;
        background-color: black;
    }
</style>
