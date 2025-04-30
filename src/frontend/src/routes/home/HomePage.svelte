<script lang="ts">
    import { onMount } from "svelte";
    import Header from "../../lib/components/layout/Header.svelte";
    import { currentTranslations } from "../../lib/locales/i18n";
    import Footer from "../../lib//components/layout/Footer.svelte";
    import HomeBox from "../../lib//components/features/HomeBox.svelte";
    import "../../lib//styles/global.css";
    import { apiRequest } from "../../lib/api";
    import { user } from "../../lib/stores/user.ts";
    import { routeTo } from "../../lib/route.ts";

    $: translatedTitle = $currentTranslations.home.large_title
        //.replace("{interactive}", `<span style="color:#80cc5d">interactive</span><br>`)
        //.replace("{interactief}", `<span style="color:#80cc5d">interactief</span><br>`);

    let role: string = "";
    let id: string = "";

    let error: string | null = null;
    let loading = true;

    onMount(() => {
        const hash = window.location.hash;
        const queryString = hash.split('?')[1];
        if (queryString) {
            const urlParams = new URLSearchParams(queryString);
            role = urlParams.get('role') || "";
            id = urlParams.get('id') || "";

            if (role && id) {
                fetchUser();
            } else {
                error = "No user ID or role provided!";
                loading = false;
            }
        } else {
            error = "Invalid URL parameters!";
            loading = false;
        }
    });

    async function fetchUser() {
        try {
            const url = `/${role}s/${id}`; // Ensure correct route (e.g., student -> students)
            const data = await apiRequest(url, 'GET');
            let username=data.name;
            user.set({ name: username, role: role, id: id });

        } catch (err) {
            error = "Failed to load user data.";
            console.error(err);
        } finally {
            loading = false;
        }
    }
</script>

<main>
    {#if error}
        <p class="error">{error}</p>
    {:else}
        <Header/>
        {#if !loading}
            <div class="notMain">
                <h1>{@html translatedTitle}</h1>
                <div class="boxes">
                    <button class="homebox_button" on:click={() => routeTo("/catalog")}>
                        <HomeBox
                        title={$currentTranslations.home.box1_title}
                        bgColor="#7951e6"
                        subtitle={$currentTranslations.home.box1_text}
                        paint_stroke_path="purple"
                        />
                    </button>
                    
                    <button class="homebox_button" on:click={() => routeTo("/classrooms")}>
                        <HomeBox
                        title={$currentTranslations.home.box2_title}
                        bgColor="#ffd35e"
                        subtitle={$currentTranslations.home.box2_text}
                        paint_stroke_path="light_orange"
                        />
                    </button>
                    
                </div>
            </div>
        {/if}
        <Footer />
    {/if}
</main>

<style>
    .boxes {
        display: flex;
        justify-content: space-around;
        margin-top: 100px;
    }

    @media (max-width: 630px) {
        .boxes {
            flex-direction: column;
            align-items: center; /* Center boxes when stacked */
            gap: 40px;
            margin-top: 60px;
        }
    }

    h1 {
        font-size: 2.5em;
        margin-top: 40px;
        font-family: "C059-Italic";
    }
    .notMain {
        max-width: 960px;
        margin: 40px auto;
        min-height: 70vh;
    }
    .homebox_button {
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
    }
</style>
