<script lang="ts">
    import LanguageSelector from "../../../lib/components/LanguageSelector.svelte";
    import PasswordField from "../../../lib/components/ui/PasswordField.svelte";
    import { currentTranslations } from "../../../lib/locales/i18n"; // Aangepaste pad
    import ErrorBox from "../../../lib/components/features/ErrorBox.svelte";
    import { onMount } from "svelte";
    import { apiBaseUrl } from "../../../config";
    import { setToken } from "../../../lib/auth.ts";
    import { goto } from "$app/navigation";

    // Define props for role and title
    export let role: string | null = "defaultRole";
    export let title: string | null = "defaultTitle";

    let username = "";
    let email = "";
    let password = "";
    let confirmPassword = "";
    let activeLang = "en"; // Default language
    let errorMessage = "";

    // Extract query parameters from the hash portion of the URL
    onMount(() => {
        const urlParams = new URLSearchParams(window.location.search);
        role = urlParams.get("role");
        title = urlParams.get("title");
        if (!role || !title) {
            console.log("No role or title provided");
            goto("/"); // redirect to home to enforce legal request construction
            return;
        }
    });

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

            goto(`/home?role=${role}&id=${userId}`);
        } catch (error: any) {
            errorMessage = error.message;
        }
    }

    const handleRegister = async () => {
        const url = `${apiBaseUrl}/authentication/register?usertype=${role}`;

        errorMessage = "";
        if (password !== confirmPassword) {
            errorMessage = "Passwords do not match";
            return;
        }
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password, email, activeLang }),
            });

            if (!response.ok) {
                throw new Error("Registration failed");
            }

            // Navigate to the login page
            //window.location.href = '/#/login'; // Use hash-based navigation
            await handleLogin(email, password);
        } catch (error: any) {
            errorMessage = error.message;
        }
    };
</script>

<div class="toggle-lang">
    <LanguageSelector />
</div>
<div class="container">
    <div class="left">
        <img
            src="/images/dwengo-groen-zwart.png"
            alt="logo dwengo"
            class="logo"
        />
        {#if errorMessage}
            <ErrorBox {errorMessage} on:close={() => (errorMessage = "")} />
        {/if}
    </div>
    <div class="form-container">
        <h1>Register as {title}</h1>
        <form on:submit|preventDefault={handleRegister}>
            <label for="username"
                >{$currentTranslations.register.username}</label
            >
            <input type="text" id="username" bind:value={username} required />

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
            <PasswordField
                bind:value={confirmPassword}
                id="confirmPassword"
                label="Confirm Password"
                required
            />

            <label for="activeLang"
                >{$currentTranslations.register.language}</label
            >
            <select id="activeLang" bind:value={activeLang}>
                <option value="en">English</option>
                <option value="nl">Nederlands</option>
            </select>

            <div class="buttons">
                <button
                    class="login"
                    type="button"
                    on:click={() => (window.location.href = "/")}
                    >{$currentTranslations.register.login}</button
                >
                <button class="submit" type="submit"
                    >{$currentTranslations.register.register}</button
                >
            </div>
        </form>
    </div>
</div>

<style>
    .container {
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: white;
    }

    .logo {
        height: 100px;
        margin-right: 40px;
    }

    .form-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        background: #f8f9fa;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
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
        border-radius: 4px;
        font-weight: 600;
        padding: 10px;
        transition: 0.3s;
    }

    .submit {
        background-color: var(--dwengo-green);
        color: white;
    }

    .login {
        background-color: #007bff;
        color: white;
    }

    .submit:hover {
        background-color: #218838;
    }

    .login:hover {
        background-color: #0056b3;
    }
</style>
