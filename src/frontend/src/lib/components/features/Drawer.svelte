<script lang="ts">
    //Drawer is used like this <Drawer navigation_items={["dashboard","questions","classrooms", "catalog"]} active="questions"/>
    export let navigation_items: string[] = []; 
    export let active: string;
    export let navigation_paths: string[] = [];

    import { currentTranslations } from '../../locales/i18n'; // Import translations
    import { user } from '../../stores/user.ts';
    import { routeToItem } from '../../route.ts';

    
</script>

<nav>
    <ul>
        {#each navigation_items as item, index}
            <div class="container" class:active={item === active}>
                <img src={"images/icons/" + item + ".png"} alt={item + " icon"}>
                <li>
                    <button class="link" on:click={() => routeToItem(navigation_paths[index])} 
                        on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') ? routeToItem(navigation_paths[index]) : null}
                        tabindex="0"
                        aria-label="Navigate to {item}">
                        {$currentTranslations.drawer[item.toLowerCase()]}
                    </button>

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
        color: inherit; 
        text-decoration: none;
        background: none;
        border: none;
        font: inherit; 
        padding: none;
        cursor: pointer;
        display: inline;
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
