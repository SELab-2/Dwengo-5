<script>
    import { onMount } from "svelte";
    import { apiRequest } from "../../lib/api";
    import Header from "../../lib/components/layout/Header.svelte";
    import Drawer from "../../lib/components/features/Drawer.svelte";

    let groups = [];
    let error = null;

    function getParamsFromURL() {
        const match = window.location.hash.match(/classrooms\/([^\/]+)\/assignments\/([^\/]+)/);
        if (match) {
            return {
                ClassId: match[1],
                AssignmentId: match[2]
            };
        }
        return { ClassId: null, AssignmentId: null };
    }

    onMount(async () => {
        const { ClassId, AssignmentId } = getParamsFromURL();
        if (ClassId && AssignmentId) {
            try {
                const response = await apiRequest(`/classes/${ClassId}/assignments/${AssignmentId}/groups`, "GET");
                groups = response.groups;
            } catch (err) {
                error = err;
            }
        }
    });
</script>

<main>
    <Header/>
    <div class="container">
        <Drawer navigation_items={["dashboard","questions","classrooms", "catalog"]} active="classrooms"/>

        <section class="content">
            {#if error}
                <p class="error">Error loading assignments: {error.message}</p>
            {:else}
                {#if groups.length == 0}
                    No groups to be found
                {:else}
                    <ul>
                        {#each groups as group}
                            <li>group</li>
                        {/each}
                    </ul>
                {/if}
            {/if}
        </section>
    </div>
</main>

<style>
    .container {
        display: flex;
        height: calc(100vh - 80px);
        background: white;
    }

    .content {
        flex: 1;
        background: white;
        padding: 20px;
        overflow-y: auto;
    }
</style>