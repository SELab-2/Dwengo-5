<script>
    export let nodeList = []; // List of nodes passed from the parent
    export let onSubmit;
    export let onCancel;

    let sourceId = "";
    let targetId = "";

    function handleSubmit() {
        if (sourceId && targetId) {
            onSubmit(sourceId, targetId);
        }
    }
</script>

<div class="modal">
    <div class="modal-content">
        <h2>Create Edge</h2>
        <label>
            Source Node:
            <select bind:value={sourceId}>
                <option value="" disabled selected>Select a source node</option>
                {#each nodeList as node}
                    <option value={node.id}>{node.label}</option>
                {/each}
            </select>
        </label>
        <label>
            Target Node:
            <select bind:value={targetId}>
                <option value="" disabled selected>Select a target node</option>
                {#each nodeList as node}
                    <option value={node.id}>{node.label}</option>
                {/each}
            </select>
        </label>
        <div class="modal-actions">
            <button on:click={handleSubmit}>Submit</button>
            <button on:click={onCancel}>Cancel</button>
        </div>
    </div>
</div>

<style>
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
    }
    .modal-content {
        background: white;
        padding: 20px;
        border-radius: 5px;
        width: 300px;
    }
    .modal-actions {
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
    }
</style>