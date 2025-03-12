<script lang="ts">
    import LoginForm from "$lib/components/LoginForm.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import LanguageSelector from "$lib/components/LanguageSelector.svelte";
    import { currentTranslations } from "../../lib/locales/i18n";
    
    let isTeacher = false;
</script>

<div class="container">
    <div class="slider">
        {#if isTeacher}
            <!-- Teacher Login Form -->
            <div class="login-form teacher-login">
                <LoginForm role="leerkracht" title={$currentTranslations.login.teacher}/>
            </div>
        {:else}
            <!-- Student Login Form -->
            <div class="login-form student-login">
                <LoginForm role="leerling" title={$currentTranslations.login.student}/>
            </div>
        {/if}

        <!-- Moving Background Image -->
        <div class="login-backdrop" class:isTeacher={isTeacher}></div>
    </div>

    <div class="logo-dwengo">
        <img src="/images/dwengo-groen-zwart.png" alt="logo dwengo" />
    </div>

    <div class="toggle-lang">
        <LanguageSelector />
    </div>

    <!-- Profile Toggle (Centered) -->
    <div class="toggle-profile">
        <input type="checkbox" id="toggle2" class="toggleCheckbox" bind:checked={isTeacher} />
        <label for="toggle2" class='toggleContainer'>
            <div>{$currentTranslations.login.student}</div>   
            <div>{$currentTranslations.login.teacher}</div>
        </label>
    </div>
</div>
<Footer/>

<style>
    
    .container {
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        background-color: white;
    }

    .slider {
        display: flex;
        width: 100%;
        height: 100%;
        position: relative;
    }

    .student-login {
        width: 50vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: white;
        position: absolute;
        left: 0;
    }

    .teacher-login {
        width: 50vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: white;
        position: absolute;
        right: 0;
    }

    .login-backdrop {
        width: 50vw;
        height: 100vh;
        background-image: url("/images/login-dwengo-backdrop.png");
        background-size: 200% 100%;
        background-position: right center;
        position: absolute;
        left: 50%;
        transition: left 0.6s ease-in-out, background-position 0.6s ease-in-out;
    }

    .login-backdrop.isTeacher {
        left: 0;
        background-position: left center;
    }

    .logo-dwengo {
        position: absolute;
        top: 0;
        left: 36%;
        padding: 1rem;
    }
    
    .logo-dwengo img {
        width: 45%;
    }

    .toggle-lang {
        position: absolute;
        top: 0;
        right: 0;
        padding: 1rem;
    }

    .toggle-profile {
        position: absolute;
        left: 50%;
        top: 25%;
        transform: translate(-50%, -50%);
        padding: 1rem;
    }

    .toggleContainer {
        position: relative;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        width: fit-content;
        border: 3px solid #343434;
        border-radius: 20px;
        background: #343434;
        font-weight: bold;
        color: white;
        cursor: pointer;
    }

    .toggleContainer::before {
        content: '';
        position: absolute;
        width: 50%;
        height: 100%;
        left: 0%;
        border-radius: 20px;
        background: #80cc5d;
        transition: all 0.3s;
    }

    .toggleCheckbox:checked + .toggleContainer::before {
        left: 50%;
    }

    .toggleContainer div {
        padding: 6px;
        text-align: center;
        z-index: 1;
    }

    .toggleCheckbox {
        display: none;
    }
</style>
