<script>
    
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let items;
    export let activeItem;

</script>

<div class="tabs">
    <ul>
        {#each items as item}
        <li on:click={() => dispatch("tabChange", item)}>
            <div class:active={ item === activeItem }>{item}</div>
        </li>
        {/each}
    </ul>
</div>

<style>
    .active {
        color: #d91b42;
        border-bottom: 2px solid #d91b42;
        padding-bottom: 8px;
    }
    .tabs {
        margin-bottom: 0;
    }
    ul {
        display:flex;
        justify-content: center;
        list-style-type: none;
    }
    li {
        margin: 0 16px;
        display: flex;
        font-size: 18px;
        color: #555;
        padding: 10px;
    }
    
</style>