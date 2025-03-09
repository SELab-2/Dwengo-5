<script>
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import HomeBox from "$lib/components/HomeBox.svelte";
    import "$lib/styles/global.css";


    let activeItem = "Home";

    const handleUpdateActiveItem = (event) => {
        activeItem = event.detail;
    };
</script>

<Header {activeItem} on:updateActiveItem={handleUpdateActiveItem} />
<main>
    <h1>Our 
        <span style="color:#80cc5d">interactive</span> learning 
        <br> platform
    </h1>
    <div class="boxes">
        <HomeBox title="Find Courses" bgColor="#7951e6" subtitle="Learn on your own"  paint_stroke_path="purple"/>
        <HomeBox title="Go to your Classrooms" bgColor="#ffd35e" subtitle="See your classrooms" paint_stroke_path="light_orange"/>
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