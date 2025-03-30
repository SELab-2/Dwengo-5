<script lang="ts">
    import { onMount } from "svelte";
    import Header from "../../../lib/components/layout/Header.svelte";
    import Drawer from "../../../lib/components/features/Drawer.svelte";
    import { user } from "../../../lib/stores/user.ts";
    import { routeTo } from "../../../lib/route.ts";
    import { apiRequest } from "../../../lib/api";
    import { currentTranslations } from "../../../lib/locales/i18n";

    let id: string | null = null;
    const role = $user.role;

    
</script>

<main>
{#if role === "teacher"}
    <div class="tables-container">
        <section class="table-section">
            <h2>{$currentTranslations.classroom.questions}</h2>
            <table>
                <thead>
                    <tr>
                        <th>{$currentTranslations.classroom.topic}</th>
                        <th class="sortable" on:click={() => sortQuestions('assignment')}>
                            {$currentTranslations.classroom.assignment}
                            {#if sortedByAssignment === false}↓{/if}
                            {#if sortedByAssignment === true}↑{/if}
                        </th>
                        <th class="sortable" on:click={() => sortQuestions('date')}>
                            {$currentTranslations.classroom.postDate}
                            {#if sortedByDate === false}↓{/if}
                            {#if sortedByDate === true}↑{/if}
                        </th>
                        <th>{$currentTranslations.classroom.author}</th>
                    </tr>
                </thead>
                <tbody>
                    {#each questions as question}
                        <tr>
                            <td>{question.topic}</td>
                            <td>{question.assignment}</td>
                            <td>{question.postDate}</td>
                            <td>{question.author}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </section>
    </div>
    {/if}
</main>

<style>

</style>