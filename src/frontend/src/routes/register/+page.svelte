<script lang="ts">
    import { page } from "$app/stores";
    import { onDestroy } from "svelte";
    import { get } from "svelte/store";
    import RegisterPage from "./registerpage.svelte";

    // Get the role from the URL query parameters
    let role = get(page).url.searchParams.get("role") || "defaultRole"; 
    let title = get(page).url.searchParams.get("title") || "defaultTitle";
</script>
<RegisterPage role={role} title={title}/>