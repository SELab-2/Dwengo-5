<script>
    import { routeTo } from "../lib/route.ts";
    import LanguageSelector from "../lib/components/LanguageSelector.svelte";
    import { currentTranslations } from "../lib/locales/i18n";

    export let error;
    export let status;
</script>

<LanguageSelector />
<div class="error-container">
    <img src="/images/dwengo-groen-zwart.svg" alt="logo" />
    <div class="backdrop">
        <div class="flex">
            <img src="/images/miss-B.png" class="miss" alt="404 Not Found" />
            {#if status}
                <h1 class="title">{$status}</h1>
            {:else}
                <h1 class="title">404</h1>
            {/if}
            {#if error?.message}
                <p>{error.message}</p>
            {:else}
                <p>{$currentTranslations.error.main}</p>
            {/if}
            <button class="return" on:click={() => routeTo("/")}
                >{$currentTranslations.error.button}</button
            >
        </div>
    </div>
</div>

<style>
    .backdrop {
        position: flex;
        background: var(--dwengo-green);
        border-radius: 0.4em;
        height: 300px;
        width: 500px;
        content: right;
        justify-content: flex-end;
        padding-left: 12rem;
    }
    .flex {
        display: flex;
        justify-content: center;
        align-items: center;

        flex-direction: column;
    }
    p {
        color: black;
        font-size: 1.5rem;
        text-align: center;
        left: 100px;
    }
    .miss {
        position: absolute;
        top: 0;
        left: 0;
        right: 400px;
        bottom: 0;
        margin: auto;
    }
    .error-container {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        margin-top: 20px;
    }
    button {
        cursor: pointer;
        border: 0;
        border-radius: 8px;
        font-weight: 600;
        margin: 0 10px;
        width: 200px;
        padding: 12px 0;
        text-transform: uppercase;
        letter-spacing: 1px;
        transition: all 0.3s ease-in-out;
        box-shadow: 0 4px 15px rgba(34, 197, 94, 0.2);
    }

    .return {
        color: white;
        background: linear-gradient(135deg, rgb(34, 197, 94), rgb(28, 164, 84));
        border: none;
    }

    button:hover {
        transform: translateY(-2px);
        box-shadow: 0 0 25px rgba(34, 197, 94, 0.6);
    }
    .return:hover {
        background: linear-gradient(135deg, rgb(28, 164, 84), rgb(22, 134, 70));
    }
</style>
