<script lang="ts">
    import LoginForm from "$lib/components/LoginForm.svelte";
    import ToggleLang from "$lib/components//ToggleLang.svelte";
    let lang = 'en';
</script>

<div class="container">
    <div class="login-backdrop">
        <img src="/images/login-dwengo-backdrop.png" alt="login backdrop" />
    </div>
    <div class="logo-dwengo">
        <img src="/images/dwengo-groen-zwart.png" alt="logo dwengo" />
    </div>
    <div class="toggle-lang">
        <ToggleLang bind:lang/>
    </div>
    <div class="login-form">
        <h1>Login</h1>
        <LoginForm />
    </div>
   
</div>

<style>
    .container {
        display: flex;
        height: 100vh; 
        width: 100vw;
    }

    .login-form {
        flex:1; 
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: white;
    }
    .login-backdrop {
        flex:1; 
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
    }

    .login-backdrop img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* Crop image to fill container */
    }

    .logo-dwengo {
        position: absolute;
        top: 0;
        left: 40%;
        padding: 1rem;
    }
    .logo-dwengo img{
        width: 45%;
    }

    .toggle-lang {
        position: absolute;
        top: 0;
        right: 0;
        padding: 1rem;
    }

    h1 {
        margin-bottom: 1rem;
    }
</style>
