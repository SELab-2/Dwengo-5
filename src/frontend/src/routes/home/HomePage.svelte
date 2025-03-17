<script lang="ts">
    import { onMount } from "svelte";
    import Header from "../../lib/components/Header.svelte";
    import { currentTranslations } from "../../lib/locales/i18n";
    import Footer from "../../lib//components/Footer.svelte";
    import HomeBox from "../../lib//components/HomeBox.svelte";
    import "../../lib//styles/global.css";
    import { apiBaseUrl } from "../../config";
  
    $: translatedTitle = $currentTranslations.home.large_title
      .replace("{interactive}", `<span style="color:#80cc5d">interactive</span><br>`)
      .replace("{interactief}", `<span style="color:#80cc5d">interactief</span><br>`);
  
    // Extract role and id from the URL query parameters
    let role: string | null = null;
    let id: string | null = null;
  
    let user: any = null;
    let error: string | null = null;
    let loading = true;
  
    // Extract query parameters when the component mounts
    onMount(() => {
      const urlParams = new URLSearchParams(window.location.search);
      role = urlParams.get("role");
      id = urlParams.get("id");
  
      console.log("Role:", role);
      console.log("ID:", id);
  
      fetchUser();
    });
  
    async function fetchUser() {
      console.log("Trying to fetch user data for id:", id);
  
      if (!id || !role) {
        error = "No user ID or role provided!";
        console.log(error);
        loading = false;
        return;
      }
  
      try {
        console.log("Before sending fetch request");
        //TODO: Kamiel 
        const response = await fetch(`${apiBaseUrl}/${role}en/${id}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }
  
        user = await response.json();
        console.log("Fetched user:", user);
      } catch (err) {
        error = err.message;
        console.log("Error:", error);
      } finally {
        loading = false; 
      }
    }
  </script>


{#if loading}
  <p>Loading...</p>
{:else}
  {#if error}
    <p class="error">{error}</p>
  {:else}
    <Header name={user.name} role={role} />
    <main>
      <h1>{@html translatedTitle}</h1>
      <div class="boxes">
        <HomeBox
          title={$currentTranslations.home.box1_title}
          bgColor="#7951e6"
          subtitle={$currentTranslations.home.box1_text}
          paint_stroke_path="purple"
        />
        <HomeBox
          title={$currentTranslations.home.box2_title}
          bgColor="#ffd35e"
          subtitle={$currentTranslations.home.box2_text}
          paint_stroke_path="light_orange"
        />
      </div>
    </main>
    <Footer />
  {/if}
{/if}

<style>
  .boxes {
    display: flex;
    justify-content: space-around;
    margin-top: 40px;
  }
  h1 {
    font-size: 2.5em;
    margin-top: 40px;
    font-family: "C059-Italic";
  }

  main {
    max-width: 960px;
    margin: 40px auto;
  }
</style>

