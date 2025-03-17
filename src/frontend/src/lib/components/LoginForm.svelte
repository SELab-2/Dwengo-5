<script lang="ts">
    import { push } from "svelte-spa-router"; // ✅ Correct function
    import { apiBaseUrl } from "../../config";
    import { currentTranslations } from "../../lib/locales/i18n";

    let email = "";
    let password = "";
    let errorMessage = "";

    export let role: string = "";
    export let title: string = "";

    const handleLogin = async () => {
        errorMessage = "";
        const url = `${apiBaseUrl}/authenticatie/aanmelden?gebruikerstype=${role}`;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const data = await response.json();
            const token = data.token;

            localStorage.setItem("token", token);

            const payload = JSON.parse(atob(token.split(".")[1]));
            const userId = payload.id;

            push(`/home?role=${role}&id=${userId}`); // ✅ Use push() instead of goto()
        } catch (error) {
            errorMessage = error.message;
        }
    };
</script>

<h1>Login {title}</h1>
<form on:submit|preventDefault={handleLogin}>
    {#if errorMessage}
        <p class="error">{errorMessage}</p>
    {/if}
    <label for="email">Email</label>
    <input type="email" id="email" bind:value={email} required />

    <label for="password">{$currentTranslations.login.password}</label>
    <input type="password" id="password" bind:value={password} required />

    <div class="buttons">
        <button class="submit" type="submit">Login</button>
        <button class="register" type="button" on:click={() => push(`/register?role=${role}&title=${title}`)}>
            {$currentTranslations.login.register}
        </button>
    </div>
</form>


<style>
    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 300px;
    }

    .error {
        color: red;
        font-size: 0.9rem;
    }

    .buttons{
        display: flex;
        justify-content: space-between; /* Ensures spacing between buttons */
        gap: 10px; /* Adds some space between buttons */
        margin-top: 10px;
    }

    button {
        cursor: pointer;
        border: 0;
        border-radius: 4px;
        font-weight: 600;
        margin: 0 10px;
        width: 200px;
        padding: 10px 0;
        box-shadow: 0 0 20px rgba(104, 85, 224, 0.2);
        transition: 0.4s;
    }

    .register {
        color: white;
        background-color: rgba(104, 85, 224, 1);
    }

    .submit {
        color: rgb(104, 85, 224);
        background-color: rgba(255, 255, 255, 1);
        border: 1px solid rgba(104, 85, 224, 1);
    }

    button:hover {
        color: white;
        box-shadow: 0 0 20px rgba(104, 85, 224, 0.6);
        background-color: rgba(104, 85, 224, 1);
}
</style>
