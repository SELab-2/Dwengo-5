<script lang="ts">
    import LoginForm from "$lib/components/LoginForm.svelte";
</script>

<div class="container">
    <div class="login-form">
        <h1>Login</h1>
        <LoginForm />
    </div>
    <div class="login-backdrop">
        <img src="/images/login-dwengo-backdrop.png" alt="login backdrop" />
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

    h1 {
        margin-bottom: 1rem;
    }
</style>
