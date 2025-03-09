<script lang="ts">
    import {changLanguage, currentLanguage, translations} from "$lib/i18n/";
    //Normaly we will get this via the cookies .
    let selectedLanguage: "en" | "nl" = currentLanguage as unknown as "en" | "nl";

    function updateLanguage(){
        changLanguage(selectedLanguage);
    }
</script>

<select bind:value={selectedLanguage} on:change={updateLanguage}>
    <option value="en">English</option>
    <option value="nl">Nederlands</option>
</select>