<script lang="ts">
    import { goto } from "$app/navigation";
    import { apiBaseUrl } from "../../../config";
    import { currentTranslations } from "../../../lib/locales/i18n";
    import { setToken } from "../../auth.ts";
    import { routeTo } from "../../route.ts";
    import PasswordField from "../ui/PasswordField.svelte";
    import ErrorBox from "./ErrorBox.svelte";

    let email = "";
    let password = "";
    let errorMessage = "";

    export let role: string = "";
    export let title: string = "";

    async function handleLogin(email: string, password: string) {
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

            routeTo(`/home?role=${role}&id=${userId}`);
        } catch (error: any) {
            errorMessage = error.message;
        }
    }
</script>

<main>
    <h1>Login {title}</h1>
    <form on:submit|preventDefault={() => handleLogin(email, password)}>
        <label for="email">Email</label>
        <input
            type="email"
            id="email"
            bind:value={email}
            required
            placeholder="example@gmail.com"
        />

        <PasswordField
            bind:value={password}
            id="password"
            label="Password"
            required
        />
        <div class="row_container">
            <button
                class="register"
                type="button"
                on:click={() =>
                    goto(
                        `/authentication/register?role=${role}&title=${title}`
                    )}
            >
                {$currentTranslations.login.register}
            </button>
            <button class="submit" type="submit">Login</button>
        </div>
    </form>
    <div class="spacing"></div>
    {#if errorMessage}
        <ErrorBox {errorMessage} on:close={() => (errorMessage = "")} />
    {/if}
</main>

<style>
    .spacing {
        height: 20px;
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
