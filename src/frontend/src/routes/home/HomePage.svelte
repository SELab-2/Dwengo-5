<script lang="ts">
    console.log("HomePage component loaded");
    import { onMount } from "svelte";
    import Header from "../../lib/components/layout/Header.svelte";
    import { currentTranslations } from "../../lib/locales/i18n";
    import Footer from "../../lib//components/layout/Footer.svelte";
    import HomeBox from "../../lib//components/features/HomeBox.svelte";
    import "../../lib//styles/global.css";
    import { apiRequest } from "../../lib/api";
    import { user } from "../../lib/stores/user.ts";
    import { routeTo } from "../../lib/route.ts";
    import { getToken } from "../../lib/auth.ts";

    $: title = $currentTranslations.home.title.replace(
        /{ (.*?) }/g,
        (_: string, text: string) =>
            `<span style="color:#80cc5d">${text}</span><br>`
    );

    $: link = $currentTranslations.home.link;

    let role: string = "";
    let id: string = "";

    let lesthemas: string[] = [
        "AI en Klimaat",
        "Sociale robot",
        "AI in de Landbouw",
        "AI in de Kunst",
        "WeGoSTEM",
        "Computationeel denken",
        "Python in de Wiskundeles",
        "Programmeren met Python",
        "Python in STEM",
        "AI in de Zorg",
        "Taaltechnologie",
        "Physical computing",
        "Algoritmes",
        "Basisprincipes van AI",
    ];

    let teksten: string[] = [
        "Leerlingen uit de derde graad (SO) onderzoeken hoe planten zich via hun huidmondjes aanpassen aan de klimaatverandering. Daarvoor tellen ze deze huidmondjes met artificiële intelligentie en beeldherkenning.",
        "Terwijl leerlingen uit de eerste graad (SO) een sociale robot knutselen en programmeren, leren ze complexe problemen oplossen via computationeel denken. Spelenderwijs werken ze aan de nieuwe eindtermen rond digitale competenties.",
        "Rotte tomaten weghalen tijdens de oogst? Daar kan artificiële intelligentie bij helpen. Maar hoe? Leerlingen uit de tweede en derde graad (SO) gaan met AI aan de slag. Misschien kan een trillende lopende band het systeem nog beter maken?",
        "Kunnen we kunst maken met artificiële intelligentie? Leerlingen uit de tweede en derde graad (SO) leven zich creatief uit met AI en reflecteren over het resultaat. Is dit kunst? Ook ontdekken ze hoe AI ons cultureel erfgoed kan beschermen.",
        "We dagen kinderen van de derde graad (BO) uit om een kunstrobot die kan tekenen te programmeren. Spelenderwijs leren de kinderen heel wat STEM-vaardigheden, van techniek tot computationeel denken.",
        "Hoe kunnen we complexe problemen oplossen met behulp van een computer? Dankzij computationeel denken! Dat kan je leren via allerlei activiteiten met óf zonder computer. Wij helpen je alvast op weg.",
        "De programmeertaal Python biedt toffe mogelijkheden om de wiskundeles te verrijken. Van de stelling van Pythagoras tot de opmaak van eigen grafieken, digitale beeldverwerking en lineaire regressie, alles wordt duidelijker met Python.",
        "De basisprincipes van programmeren aanleren? Dat kan perfect via dit pakket. We gaan aan de slag met Python en leren alles over sequenties, herhalingsstructuur en keuzestructuur. Dat is precies wat er in de eindtermen staat. En meer!",
        "In dit pakket leer je complexe problemen eenvoudiger én sneller aanpakken met de programmeertaal Python. Programmeren kan immers een verbindende rol spelen tussen wetenschap, techniek, ontwerp en toegepaste wiskunde. Kortom, dankzij Python halen we het beste uit STEM.",
        "Ziekenhuizen maken vandaag al gebruik van artificiële intelligentie. Leerlingen uit de tweede en derde graad (SO) ontdekken welke systemen er bestaan en hoe ze dokters helpen om beslissingen te nemen. Zo leren leerlingen de principes van de beslissingsboom, een veelgebruikte techniek in machine learning.",
        "Waar taal en technologie samenkomen, ontstaat het domein van Natural Language Processing. Kan een computer teksten begrijpen, vertalen of zelfs schrijven? Kan een computer emoties herkennen? Leerlingen uit de tweede en derde graad (SO) leren er alles over in dit pakket.",
        "Een muziekinstrument, auto of weerstation bouwen? Dat kan met Dwenguino, een microcontrollerplatform met een eigen programmeeromgeving. Leerlingen uit zowel basis- als secundair onderwijs kunnen er meteen mee aan de slag. In het echt of in onze simulator, blokgebaseerd of tekstueel.",
        "Leerlingen uit de tweede en de derde graad (SO) leren hoe ze algoritmes kunnen gebruiken om problemen op te lossen. Ze leren hoe ze algoritmes kunnen ontwerpen en hoe ze de efficiëntie van algoritmes kunnen analyseren. Ze leren ook hoe ze algoritmes kunnen gebruiken om problemen op te lossen.",
        "Onder dit lesthema bundelen we verschillende activiteiten waarin de basisprincipes van artificiële intelligentie (AI) aan bod komen. Leerlingen leren wat AI is, hoe het werkt en hoe het kan worden toegepast in verschillende domeinen.",
    ];

    let error: string | null = null;
    let loading = true;

    onMount(() => {
        document.body.style.overflow = "scroll";
        document.documentElement.style.overflow = "scroll";
        try {
            const urlParams = new URLSearchParams(window.location.search);
            role = urlParams.get("role") || "";
            id = urlParams.get("id") || "";
            console.log("the role is " + role);

            if (!getToken()) {
                routeTo("/login");
                return;
            }

            if (role && id) {
                fetchUser(); // Make sure this function is safe too
            } else {
                error = "No user ID or role provided!";
                loading = false;
            }
        } catch (e) {
            console.error("Error in onMount:", e);
        }
    });

    async function fetchUser() {
        try {
            const url = `/users/${id}`; // Ensure correct route (e.g., student -> students)
            const data = await apiRequest(url, "GET");
            let username = data.name;
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
        <Header />
        {#if !loading}
            <div class="title-container">
                <h1>{@html title}</h1>
            </div>
            <div class="content">
                <div class="grid">
                    {#each lesthemas as thema, index}
                        <button
                            class="link-button"
                            on:click={() =>
                                routeTo(`/catalog/learningtheme/${index}`)}
                        >
                            <div class="card">
                                <h2>{thema}</h2>
                                <p>{teksten[index]}</p>
                            </div>
                        </button>
                    {/each}
                </div>
            </div>
        {/if}
        <Footer />
    {/if}
</main>

<style>
    .title-container {
        flex: 0;
        padding-left: 20px;
    }

    .content {
        flex: 1;
        background-color: white;
        margin-left: 100px;
        margin-right: 100px;
        margin-top: 30px;
        border-radius: 15px;
        border: 15px solid var(--dwengo-green);
        padding-left: 15px;
        padding-right: 15px;
        padding-top: 10px;
        padding-bottom: 10px;
        max-height: 70vh; /* Adjust height as needed */
        overflow-y: auto; /* Enables vertical scrolling */
    }

    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
        width: 100%;
    }

    .card {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        background-color: #fff;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 16px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
    }

    .card:hover,
    .card:focus {
        transform: translateY(-4px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .card h2 {
        font-size: 1.2rem;
        margin-bottom: 0.5em;
    }

    .card p {
        flex-grow: 1;
        color: #444;
    }

    .link-button {
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 0.5rem 1rem;
        font-size: 1rem;
        text-decoration: none;
        transition: all 0.2s ease;
        cursor: pointer;
    }

    h1 {
        font-size: 2.5em;
        margin-top: 40px;
        font-family: "C059-Italic";
    }
</style>
