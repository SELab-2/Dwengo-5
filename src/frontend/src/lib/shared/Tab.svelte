<script>
    import { createEventDispatcher } from 'svelte';
    import Router, {location, link, push} from 'svelte-spa-router';
    import { routeToItem } from '../route.ts';

    const dispatch = createEventDispatcher();

    const onTabClick = (item) => {
        // Update activeItem based on the tab change
        activeItem = item;  

        routeToItem(item);
  };



    export let items;
    export let activeItem;
</script>

<div class="tabs">
    <ul>
      {#each items as item}
        <li on:click={() => onTabClick(item)}>
          <div class:active={ item === activeItem }>{item}</div>
        </li>
      {/each}
    </ul>
</div>

<style>
    .active {
        color: var(--dwengo-green);
    }
    .tabs {
        font-family: 'C059-Roman';
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