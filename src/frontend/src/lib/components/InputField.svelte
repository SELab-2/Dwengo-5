<script lang="ts">
    //this is some chatgpt bullshit i will change
    export let type = "text";
    export let value = "";
    export let placeholder = "";
    export let id = "";

    let inputValue = value;
</script>

<div class="input-group">
    <input type="student" id={id} bind:value={inputValue} placeholder={placeholder} />
</div>

<style>
    .input-group {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    input {
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
    }

    input:focus {
        border-color: #007bff;
    }
</style>
