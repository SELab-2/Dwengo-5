<script lang="ts">
    import { onMount } from 'svelte';
    import HomePage from './HomePage.svelte';
    onMount(() => {
      console.log('✅ Home page loaded!');
    });
  </script>
  
  <h1>Hello from /home</h1>
  <HomePage/>
  