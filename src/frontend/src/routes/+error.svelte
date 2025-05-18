<script>
    export let error;
    export let status;
</script>

<svelte:head>
    <title>{status}</title>
</svelte:head>

<h1>{status}</h1>

{#if error?.message}
    <p>{error.message}</p>
{:else}
    <p>The page you are looking for does not exist.</p>
{/if}
