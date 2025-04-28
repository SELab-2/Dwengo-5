<script lang="ts">
    import LoginForm from "../../../lib/components/features/LoginForm.svelte";
    import Footer from "../../../lib/components/layout/Footer.svelte";
    import LanguageSelector from "../../../lib/components/LanguageSelector.svelte";
    import { currentTranslations } from "../../../lib/locales/i18n"; // Aangepaste pad
    import { getToken, clearToken } from "../../../lib/auth";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";

    onMount(() => {
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
    });

    function toggleForm() {
        let showStudentForm = false;
        let showTeacherForm = false;
        if (isTeacher) {
            showStudentForm = false;
            setTimeout(() => {
                showTeacherForm = true;
            }, 3000); // 3 seconds delay
        } else {
            showTeacherForm = false;
            setTimeout(() => {
                showStudentForm = true;
            }, 3000); // 3 seconds delay
        }
    }

    let isTeacher = false;
</script>
<div class="container">
    <div class="slider">
        {#if isTeacher}
            <div class="login-form teacher-login" transition:fade>
                <LoginForm role="teacher" title={$currentTranslations.login.teacher}/>
            </div>
        {:else}
            <div class="login-form student-login" transition:fade>
                <LoginForm role="student" title={$currentTranslations.login.student}/>
            </div>
        {/if}
        <div class="login-backdrop" class:isTeacher={isTeacher}></div>
    </div>

    <div class="logo-dwengo">
        <img src="../../../static/images/dwengo-groen-zwart.png" alt="logo dwengo" />
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
        background-image: url("../../../static/images/login-dwengo-backdrop.png");
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
