<script lang="ts">
    import { onMount } from "svelte";
    import Header from "../../../lib/components/layout/Header.svelte";
    import Drawer from "../../../lib/components/features/Drawer.svelte";
    import { user } from "../../../lib/stores/user.ts";
    import { routeTo } from "../../../lib/route.ts";
    import { apiRequest } from "../../../lib/api";
    import { currentTranslations } from "../../../lib/locales/i18n";
    import { conversationStore } from "../../../lib/stores/conversation.ts";


    let id: string | null = null;
    const role = $user.role;

    let conversationData = null;

    conversationStore.subscribe((data) => {
        if (data) conversationData = data;
    });

    console.log(conversationData);

    onMount(async() => {
        const hash = window.location.hash;
        const queryString = hash.split('?')[1];
        const conversation = hash.split('/')[2].split('?')[0];
        console.log(conversation);

        if (queryString) {
            const urlParams = new URLSearchParams(queryString);
            id = urlParams.get('id');
        }

        const response = await apiRequest(`/${role}s/${id}/classes`, "GET");

    })
</script>

<main>
    <h1>Joepie</h1>
</main>

<style>

</style>