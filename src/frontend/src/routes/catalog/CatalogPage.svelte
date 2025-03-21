<script lang="ts">
  import { onMount } from "svelte";
  import Header from "../../lib/components/layout/Header.svelte";
  import { currentTranslations } from "../../lib/locales/i18n";
  import Footer from "../../lib/components/layout/Footer.svelte";
  import Drawer from "../../lib/components/features/Drawer.svelte";
  import "../../lib/styles/global.css";
  import { apiBaseUrl } from "../../config";
</script>

<main>
  <Header name={"test"} role={"student"} />
  <div class="container">
      <div class="title-container">
        <p>Onze <span class="green-text">lesthema's</span></p>
      </div>

      <div class="bottom">
          <div class="drawer-container">
            <Drawer navigation_items={["assignments", "questions", "classrooms", "catalog"]} active="catalog" />
          </div>

          <div class="catalog-content">
          </div>
      </div>
  </div>
  
  <Footer />
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    min-height: 100vh; /* Full viewport height */
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  .container {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    padding-top: 50px;
  }
  .title-container {
    flex: 0;
    padding-left: 20px;
  }
  .bottom {
    flex: 1;
    display: flex;
  }
  .drawer-container {
    flex: 0;
    display: flex;
    flex-direction: column;
    padding-top: 40px;
  }
  .catalog-content {
    flex: 1;
    background-color: white;
    margin-left: 80px;
    margin-right: 80px;
    margin-top: 30px;
    border-radius: 15px;
    border: 15px solid var(--dwengo-green);
  }


  p {
    font-family: 'C059-Roman';
    font-size: 4rem;
    justify-content: top; /* Center vertically */
  }

  .green-text {
    color: var(--dwengo-green); /* Makes "lesthema's" green */
  }
</style>