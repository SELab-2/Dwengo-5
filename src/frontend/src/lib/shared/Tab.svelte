<script>
    import { createEventDispatcher } from 'svelte';
    import Router, {location, link, push} from 'svelte-spa-router';

    const dispatch = createEventDispatcher();

    function getQueryParams() {
        const hash = window.location.hash; // Get the hash part of the URL
        const queryParams = new URLSearchParams(hash.split('?')[1] || ''); // Extract the query parameters after '?'
        return {
        role: queryParams.get('role'),
        id: queryParams.get('id'),
        };
    }

    const onTabClick = (item) => {
        // Update activeItem based on the tab change
        activeItem = item; 

        // Get current query parameters
        const { role, id } = getQueryParams();

        // Navigate to the new path, appending the current query parameters
        push(`/${item.toLowerCase()}?role=${role}&id=${id}`);
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
        padding-bottom: 8px;
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