<script>
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
	import Team from "$lib/components/Team.svelte";

    let activeItem = "Home";

    const handleUpdateActiveItem = (event) => {
        activeItem = event.detail;
    };
</script>

<Header {activeItem} on:updateActiveItem={handleUpdateActiveItem} />
<main>
	{#if activeItem === "Over ons team"}
		<Team/>
	{:else}
    	<p>{activeItem}</p>
	{/if}
</main>
<Footer />

<style>
    main {
        max-width: 960px;
        margin: 40px auto;
    }
</style>