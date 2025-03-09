<script>
    import Header from "$lib/components/Header.svelte";
    import {translations} from "$lib/i18n";
    import Footer from "$lib/components/Footer.svelte";
    import HomeBox from "$lib/components/HomeBox.svelte";
    import "$lib/styles/global.css";
</script>

<!--Header will recive the info from Login to make correct name and role-->
<Header/>
<main>
    <h1>Our 
        <span style="color:#80cc5d">interactive</span> learning 
        <br> platform
    </h1>
    <div class="boxes">
        <HomeBox title={$translations.home.box1_title} bgColor="#7951e6" subtitle={$translations.home.box1_text}  paint_stroke_path="purple"/>
        <HomeBox title={$translations.home.box2_title} bgColor="#ffd35e" subtitle={$translations.home.box2_text} paint_stroke_path="light_orange"/>
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