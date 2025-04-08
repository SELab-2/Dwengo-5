<script lang="ts">
    import { createEventDispatcher } from "svelte";

    export let errorMessage: string = "";

    const dispatch = createEventDispatcher();

    function handleClose() {
        dispatch("close");
    }
  </script>
  
  <div class="error_back">
    <div class="error_top">
      <div class="error_left">
        <div class="error_circle">!</div>
        <h2>Error</h2>
      </div>
      <button class="close_error" on:click={handleClose}>X</button>
    </div>
  
    <div class="error_message">
      <p>{errorMessage}</p>
    </div>
  </div>
  
  <style>
    .error_back {
        background-color: var(--red-medium);
        height: 150px;
        width: 300px;
        border-radius: 20px;
        padding: 16px;
        
        box-sizing: border-box;
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
  
    .error_top {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
  
    .error_left {
        display: flex;
        align-items: center;
        gap: 10px;
    }
  
    .error_circle {
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--red-medium);
        background-color: white;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        font-weight: bold;
    }
  
    .close_error {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        font-weight: bold;
    }
  
    .error_message {
        margin-top: 10px;
    }
  
    h2 {
        margin: 0;
    }
  </style>
  