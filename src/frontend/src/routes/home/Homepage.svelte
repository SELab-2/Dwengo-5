<script>
    import Header from "$lib/components/Header.svelte";
    import { currentTranslations } from "$lib/locales/i18n";
    import Footer from "$lib/components/Footer.svelte";
    import HomeBox from "$lib/components/HomeBox.svelte";
    import "$lib/styles/global.css";

    $: translatedTitle = $currentTranslations.home.large_title.replace(
        "{interactive}",
        `<span style="color:#80cc5d">interactive</span><br>`
    ).replace(
        "{interactief}",
        `<span style="color:#80cc5d">interactief</span><br>`
    );
</script>

<!--Header will recive the info from Login to make correct name and role-->
<Header/>
<main>
    <h1>{@html translatedTitle}</h1>
    <div class="boxes">
        <HomeBox title={$currentTranslations.home.box1_title} bgColor="#7951e6" subtitle={$currentTranslations.home.box1_text}  paint_stroke_path="purple"/>
        <HomeBox title={$currentTranslations.home.box2_title} bgColor="#ffd35e" subtitle={$currentTranslations.home.box2_text} paint_stroke_path="light_orange"/>
    </div>
</main>
<Footer />

<style>
    .boxes {
        display: flex;
        justify-content: space-around;
        margin-top: 40px;
    }
    h1 {
        font-size: 2.5em;
        margin-top: 40px;
        font-family:'C059-Italic';
    }

    main {
        max-width: 960px;
        margin: 40px auto;
    }
</style>