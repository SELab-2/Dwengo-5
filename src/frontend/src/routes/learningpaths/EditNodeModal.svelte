<script lang="ts">
    import { currentTranslations } from "../../lib/locales/i18n";

    interface Node {
        id: string;
        label: string;
    }

    export let onDelete: Function;
    export let onCancel: (event: MouseEvent | void) => void;

    export let nodeId = "";

    let inputElement: HTMLInputElement;

    function handleDelete() {
        onDelete(nodeId); // Pass all values to the parent
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Delete") {
            handleDelete(); // Delete on Delete key
        } else if (event.key === "Escape") {
            onCancel(); // Cancel on Escape
        }
    }

    import { onMount, onDestroy } from "svelte";

    onMount(() => {
        window.addEventListener("keydown", handleKeydown);

        if (inputElement) {
            inputElement.focus(); // Focus the input element when the modal opens
        }
    });

    onDestroy(() => {
        window.removeEventListener("keydown", handleKeydown);
    });
</script>

<div class="modal">
    <div class="modal-content">
        <h2>{$currentTranslations.CreateLearningPath.editModalTitle}</h2>
        <div class="modal-actions">
            <button class="button primary" on:click={handleDelete}>{$currentTranslations.CreateLearningPath.delete}</button>
            <button class="button secondary" on:click={onCancel}>{$currentTranslations.CreateLearningPath.cancel}</button>
        </div>
    </div>
</div>

<style>
    @import "../../lib/styles/global.css";

    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .modal-content {
        background: var(--off-white);
        padding: 30px;
        border-radius: 8px;
        width: 400px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    h2 {
        margin: 0;
        font-size: 1.5rem;
        color: var(--dwengo-dark-green);
        text-align: center;
    }

    .modal-actions {
        display: flex;
        justify-content: space-between;
        gap: 10px;
    }

    .button {
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        font-weight: bold;
        cursor: pointer;
        transition: background 0.3s, transform 0.2s;
    }

    .button.primary {
        background: var(--dwengo-green);
        color: var(--off-white);
    }

    .button.primary:hover {
        background: var(--green-medium);
    }

    .button.secondary {
        background: var(--teal-light);
        color: var(--off-white);
    }

    .button.secondary:hover {
        background: var(--teal-dark);
    }

</style>