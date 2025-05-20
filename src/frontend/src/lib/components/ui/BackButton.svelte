<script lang="ts">
    export let text: string = "";
</script>

<button class="goBack" on:click={() => window.history.back()}
    >&lt; {text || "Back"}</button
>

<style>
    .goBack {
        background-color: var(--dwengo-green);
        color: black;
        border: none;
        border-radius: 5px;
        padding: 10px;
        margin: 10px;
        cursor: pointer;
    }
</style>
