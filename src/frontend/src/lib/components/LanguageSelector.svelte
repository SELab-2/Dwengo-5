<script lang="ts">
    import { changeLanguage, currentLanguage } from "../locales/i18n";

let selectedLanguage: "en" | "nl" = "en";

function updateLanguage() {
    changeLanguage(selectedLanguage);
}
</script>
<div class="language-selector">
    <img src="images/globe.png" alt="globe">
    <!-- Select Language -->
    <select on:change="{(e) => changeLanguage(e.target.value)}">
        <option value="en">en</option>
        <option value="nl">nl</option>
    </select>
</div>

<style>
    .language-selector {
        display: flex;         
        align-items: center;   
        gap: 8px;              
    }

    img {
        width: 20px;
        height: 20px;
    }

    select {
        border: none;
        background-color: transparent;
        font-size: 16px;
        cursor: pointer;
    }
</style>
