<script lang="ts">
    //imports 
    import Header from "../../../lib/components/layout/Header.svelte";
    import BackButton from "../../../lib/components/ui/BackButton.svelte";
    import { currentTranslations } from "../../../lib/locales/i18n";
    import Drawer from "../../../lib/components/features/Drawer.svelte";

    export let className: string = "tempClassName";
    const navigation_items = ["assignments", "questions"];
</script>

<div>
    <Header/>
    <div class="body">
        <BackButton text={$currentTranslations.assignments.classgroup}/>
        <h1>{$currentTranslations.assignments.class}: {className}</h1>
        <div class="content">
            <Drawer navigation_items={navigation_items} active="assignments"/>
            <p class="assignments">

            </p>
        </div>
    </div>
</div>

<style>
    .content{
        display: flex;
        gap: 10px;
    }

    .assignments{
        border-color: var(--dwengo-green);
        border-width: 2px;
        width: 80%;
        height: 100px;
    }
</style>