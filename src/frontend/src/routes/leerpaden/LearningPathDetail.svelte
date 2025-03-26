<script lang='ts'>
    import { onMount } from "svelte";
    import Header from "../../lib/components/layout/Header.svelte";
    import { currentTranslations, savedLanguage, currentLanguage } from "../../lib/locales/i18n";
    import Footer from "../../lib/components/layout/Footer.svelte";
    import Drawer from "../../lib/components/features/Drawer.svelte";
    import "../../lib/styles/global.css";
    import { apiBaseUrl } from "../../config";
    import { apiRequest } from "../../lib/api";
    import { user } from "../../lib/stores/user.ts";
    import { get } from "svelte/store";
    

    // Get the dynamic ID from the URL
    //$: id = $page.params.id;
    let url = window.location.pathname;

    
    //let id = url.split("/").pop();
</script>

<p>OOOOOOOOOOOOOOOOOOOOOOOO</p>
<p>{id}</p>
<p>{url}</p>