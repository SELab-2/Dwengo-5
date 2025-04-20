<script lang="ts">

    interface Node {
        id: string;
        label: string;
    }

    export let nodeList: Node[] = []; // List of nodes passed from the parent
    export let onSubmit: Function;
    export let onCancel: (event: MouseEvent | void) => void;

    export let sourceId = "";

    let targetId = "";
    let label = "";

    let inputElement: HTMLInputElement;

    function handleSubmit() {
        onSubmit(sourceId, label, targetId); // Pass all values to the parent
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Enter") {
            handleSubmit(); // Submit on Enter
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
        <h2>Create a New Node</h2>
        <div class="form-group">
            <label for="node-label">Node Label</label>
            <input
                id="node-label"
                type="text"
                placeholder="Enter node label"
                bind:value={label}
                bind:this={inputElement}
            />
        </div>
        <div class="form-group">
            <label for="target-node">Select Target Node</label>
            <select id="target-node" bind:value={targetId}>
                <option value="" disabled selected>Select a target node</option>
                {#each nodeList as node}
                    {#if node.id !== sourceId && node.id !== '1'} <!-- Exclude the source node from the list -->
                        <option value={node.id}>{node.label}</option>
                    {/if}
                {/each}
            </select>
        </div>
        <div class="modal-actions">
            <button class="button primary" on:click={handleSubmit}>Submit</button>
            <button class="button secondary" on:click={onCancel}>Cancel</button>
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

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    label {
        font-size: 0.9rem;
        font-weight: bold;
        color: var(--teal-dark);
    }

    input,
    select {
        padding: 10px;
        border: 1px solid var(--teal-light);
        border-radius: 4px;
        font-size: 1rem;
        color: var(--teal-dark);
        background: var(--off-white);
        outline: none;
        transition: border-color 0.3s;
    }

    input:focus,
    select:focus {
        border-color: var(--dwengo-green);
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