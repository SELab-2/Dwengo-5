<script lang="ts">
    import { push } from "svelte-spa-router"; 
    import { apiBaseUrl } from "../../../config";
    import { currentTranslations } from "../../../lib/locales/i18n";
    import { setToken } from "../../auth";

    let email = "";
    let password = "";
    let errorMessage = "";

    export let role: string = "";
    export let title: string = "";

    const handleLogin = async () => {
        errorMessage = "";
        const url = `${apiBaseUrl}/authentication/login?usertype=${role}`;

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

            setToken(token);

            const payload = JSON.parse(atob(token.split(".")[1]));
            const userId = payload.id;

            push(`/home?role=${role}&id=${userId}`); 
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
        <button class="register" type="button" on:click={() => push(`/register?role=${role}&title=${title}`)}>
            {$currentTranslations.login.register}
        </button>
        <button class="submit" type="submit">Login</button>
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

    .buttons {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-top: 10px;
}

button {
    cursor: pointer;
    border: 0;
    border-radius: 8px;
    font-weight: 600;
    margin: 0 10px;
    width: 200px;
    padding: 12px 0;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: all 0.3s ease-in-out;
    box-shadow: 0 4px 15px rgba(34, 197, 94, 0.2);
}

.register {
    color: rgb(34, 150, 94);
    background-color: white;
    border: 2px solid rgb(34, 150, 94);
}

.submit {
    color: white;
    background: linear-gradient(135deg, rgb(34, 197, 94), rgb(28, 164, 84));
    border: none;
}

button:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 25px rgba(34, 197, 94, 0.6);
}

.register:hover {
    background: rgb(34, 150, 94);
    color: white;
}

.submit:hover {
    background: linear-gradient(135deg, rgb(28, 164, 84), rgb(22, 134, 70));
}
</style>
