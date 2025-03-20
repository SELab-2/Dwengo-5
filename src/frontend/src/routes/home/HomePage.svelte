<script lang="ts">
    import { onMount } from "svelte";
    import Header from "../../lib/components/layout/Header.svelte";
    import { currentTranslations } from "../../lib/locales/i18n";
    import Footer from "../../lib//components/layout/Footer.svelte";
    import HomeBox from "../../lib//components/features/HomeBox.svelte";
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

        const hash = window.location.hash; 
        const queryString = hash.split('?')[1];
        if (queryString) {
            const urlParams = new URLSearchParams(queryString);
            role = urlParams.get('role') || role;
            id = urlParams.get('id') || title;
        
            fetchUser();
        }
    });
  
    async function fetchUser() {
      console.log("Trying to fetch user data for id:", id);
      console.log(`Bearer ${sessionStorage.getItem('token')}`);
  
      if (!id || !role) {
        error = "No user ID or role provided!";
        console.log(error);
        loading = false;
        return;
      }
  
      try {
        const url = `${apiBaseUrl}/${role}s/${id}` // s is added to achieve correct route (student -> students)
        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${sessionStorage.getItem('token')}`
          },
        });
  
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }
  
        user = await response.json();
      } catch (err) {
        // TODO: handle error
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

