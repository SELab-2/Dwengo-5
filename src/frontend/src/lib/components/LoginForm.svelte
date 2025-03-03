<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    //this is some chatgpt bullshit i will change
    let email = "";
    let password = "";
    let errorMessage = "";

    const handleLogin = async () => {
        errorMessage = "";
        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error("Invalid credentials");
            }

            goto("/dashboard"); 
        } catch (error) {
            errorMessage = error.message;
        }
    };
</script>

<form on:submit|preventDefault={handleLogin}>
    {#if errorMessage}
        <p class="error">{errorMessage}</p>
    {/if}

    <label for="email">Email</label>
    <input type="email" id="email" bind:value={email} required />

    <label for="password">Password</label>
    <input type="password" id="password" bind:value={password} required />

    <button type="submit">Login</button>
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

    button {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 10px;
        cursor: pointer;
    }

    button:hover {
        background-color: #0056b3;
    }
</style>
