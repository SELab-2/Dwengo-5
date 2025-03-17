<script lang="ts">
    import LoginForm from "../../../lib/components/LoginForm.svelte";
    import Footer from "../../../lib/components/Footer.svelte";
    import LanguageSelector from "../../../lib/components/LanguageSelector.svelte";
    import { currentTranslations } from "../../../lib/locales/i18n"; // Aangepaste pad

    let isTeacher = false;
</script>

<div class="container">
    <div class="slider">
        {#if isTeacher}
            <div class="login-form teacher-login">
                <LoginForm role="leerkracht" title={$currentTranslations.login.teacher}/>
            </div>
        {:else}
            <div class="login-form student-login">
                <LoginForm role="leerling" title={$currentTranslations.login.student}/>
            </div>
        {/if}
        <div class="login-backdrop" class:isTeacher={isTeacher}></div>
    </div>

    <div class="logo-dwengo">
        <img src="/images/dwengo-groen-zwart.png" alt="logo dwengo" />
    </div>

    <div class="toggle-lang">
        <LanguageSelector />
    </div>

    <div class="toggle-profile">
        <input type="checkbox" id="toggle2" class="toggleCheckbox" bind:checked={isTeacher} />
        <label for="toggle2" class='toggleContainer'>
            <div>{$currentTranslations.login.student}</div>   
            <div>{$currentTranslations.login.teacher}</div>
        </label>
    </div>
</div>
<Footer/>
