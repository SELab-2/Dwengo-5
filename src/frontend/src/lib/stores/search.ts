//inspiration
//https://www.youtube.com/watch?app=desktop&v=lrzHaTcpRh8

/*How to use:
    import { createSearchStore, searchHandler } from "./lib/stores/search.ts";

	Here you create the store. 
	SingleElementOfData will be somthing like a single learningpath object.
	searchTerms is a way to define on what elements of the JSON the searchbar will look.
	$: searchProducts = fetchedData.map((singleElementOfData) => ({
      ...singleElementOfData,
      searchTerms: `${singleElementOfData.name} ${singleElementOfData.description}`
    }));

	First initialize the search store with empty list 
	let searchStore = createSearchStore([]);
    
	After the data is fetched, you can set the store with the data.
    $: if (searchProducts.length) {
        searchStore.set({
          data: searchProducts,
          filtered: searchProducts,
          search: $searchStore?.search || ""
        });
      }

	Make sure to set the searchTerms in the data you are passing to the store.
	Make sure the searchterm is destroyed when the component is destroyed.
	const unsubscribe = searchStore.subscribe((model) => searchHandler(model));
    onDestroy(unsubscribe);


	In HTML you can use the store like this:
	 <input type="search" placeholder="search..." bind:value={$searchStore.search} />
              <ul>
                {#if $searchStore.filtered}
                  {#each $searchStore.filtered as data}
					...
					{/each}
                {:else}
                  <li>No learning paths found</li>
                {/if}
              </ul>
*/
import { writable } from "svelte/store"

export interface SearchStoreModel<T extends Record<PropertyKey, any>> {
	data: T[]
	filtered: T[]
	search: string
}

export const createSearchStore = <T extends Record<PropertyKey, any>>(
	data: T[],
) => {
	const { subscribe, set, update } = writable<SearchStoreModel<T>>({
		data: data,
		filtered: data,
		search: ""
	})

	return {
		subscribe,
		set,
		update
	}
}

export const searchHandler = <T extends Record<PropertyKey, any>>(
    store: SearchStoreModel<T>,
) => {
    if (!store.data) return;
    
    const searchTerm = store.search.toLowerCase() || "";
    store.filtered = store.data.filter((item) => {
        return item.searchTerms.toLowerCase().includes(searchTerm);
    });
}