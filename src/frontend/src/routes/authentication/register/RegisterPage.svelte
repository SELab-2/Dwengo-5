<script lang="ts">
    import LanguageSelector from "../../../lib/components/LanguageSelector.svelte";
    import PasswordField from "../../../lib/components/ui/PasswordField.svelte";
    import { currentTranslations } from "../../../lib/locales/i18n"; // Aangepaste pad

    import { onMount } from 'svelte';
    import { apiBaseUrl } from "../../../config";

    // Define props for role and title
    export let role: string = "defaultRole";
    export let title: string = "defaultTitle";

    let username = "";
    let email = "";
    let password = "";
    let confirmPassword = "";
    let activeLang = "en"; // Default language
    let errorMessage = "";

    // URL to register with the role.
    let url = '';

    // Extract query parameters from the hash portion of the URL
    onMount(() => {
      const hash = window.location.hash; 
      const queryString = hash.split('?')[1];
      if (queryString) {
        const urlParams = new URLSearchParams(queryString);
        role = urlParams.get('role') || role;
        title = urlParams.get('title') || title;
        url = `${apiBaseUrl}/authentication/register?usertype=${role}`;
      }
    });

    const handleRegister = async () => {
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
        window.location.href = '/#/login'; // Use hash-based navigation
      } catch (error: any) {
        errorMessage = error.message;
      }
    };
</script>

<div class="toggle-lang">
  <LanguageSelector />
</div>
<div class="container">
  <img src="../../static/images/dwengo-groen-zwart.png" alt="logo dwengo" class="logo" />
  <div class="form-container">
    <h1>Register as {title}</h1>
    <form on:submit|preventDefault={handleRegister}>
      <label for="username">{$currentTranslations.register.username}</label>
      <input type="text" id="username" bind:value={username} required />

      <label for="email">Email</label>
      <input type="email" id="email" bind:value={email} required />

      <PasswordField bind:value={password} id="password" label="Password" required />
      <PasswordField bind:value={confirmPassword} id="confirmPassword" label="Confirm Password" required />
      
      <label for="activeLang">{$currentTranslations.register.language}</label>
      <select id="activeLang" bind:value={activeLang}>
        <option value="en">English</option>
        <option value="nl">Nederlands</option>
      </select>

      {#if errorMessage}
        <p class="error">{errorMessage}</p>
      {/if}

      <div class="buttons">
        <button class="login" type="button" on:click={() => window.location.href = '/#/login'}>{$currentTranslations.register.login}</button>
        <button class="submit" type="submit">{$currentTranslations.register.register}</button>
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
  
    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 300px;
    }
  
    label {
      font-weight: bold;
    }
  
    input, select {
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
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
  
    .error {
      color: red;
      font-size: 0.9rem;
    }
  </style>